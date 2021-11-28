import React, { useState, useCallback, useEffect } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	Platform,
	Dimensions,
	Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
	SafeAreaView,
	UnderlineText,
	TextInput,
	TouchableView,
	TopBar,
	MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import Icons from 'react-native-vector-icons/AntDesign';
import { useAutoFocus, AutoFocusProvider } from '../contexts';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { initialError, postTeamName } from '../store/team';
import { ModalInput, Spinner } from '../components';
import { NavigationHeader } from '../theme';
import { useLayout, useMakeTimetable } from '../hooks';
import { cloneDates, getColor } from '../store/timetable';
import FontAweSome from 'react-native-vector-icons/FontAwesome5';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { getUserMe, makeGroupColor } from '../store/login';
const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
export default function TeamList() {
	const {
		user,
		id,
		clubs,
		token,
		joinTeam,
		joinName,
		postTeamError,
		joinTeamError,
		loadingJoin,
		loadingChangeColor,
		teamColor,
		joinUri,
		loadingUserMe,
	} = useSelector(({ login, team, loading }: RootState) => ({
		user: login.user,
		id: login.id,
		clubs: login.clubs,
		token: login.token,
		joinTeam: team.joinTeam,
		joinName: team.joinName,
		joinTeamError: team.joinTeamError,
		postTeamError: team.postTeamError,
		loadingJoin: loading['team/JOIN_TEAM'],
		loadingChangeColor: loading['team/CHANGE_COLOR'],
		teamColor: team.teamColor,
		joinUri: team.joinUri,
		loadingUserMe: loading['login/USER_ME'],
	}));
	const [dimensions, setDimensions] = useState({ window, screen });
	const [modalMode, setModalMode] = useState('make');
	const [modalVisible, setModalVisible] = useState(false);
	const navigation = useNavigation();
	const dispatch = useDispatch();

	// useEffect
	useEffect(() => {
		dispatch(getUserMe({ id, token, user }));
	}, [joinTeam]);
	useEffect(() => {
		setModalMode('make');
	}, [joinTeamError]);
	useEffect(() => {
		dispatch(makeGroupColor(teamColor));
		dispatch(getColor({ color: teamColor, peopleCount: 1 }));
	}, [loadingChangeColor, teamColor]);
	// useCallback
	// Navigation 이동
	const goTeamTime = useCallback(
		(name) => {
			if (modalMode === 'join') {
				navigation.navigate('TeamTime', {
					name,
					user,
					id,
					token,
					modalMode,
				});
			} else {
				navigation.navigate('TeamTime', {
					name,
					user,
					id,
					token,
					modalMode,
				});
			}
			dispatch(initialError());
			setModalMode('make');
		},
		[modalMode]
	);
	// 모달 모드 분리
	const onMakeTeamTime = useCallback(() => {
		setModalMode('make');
		setModalVisible(true);
	}, []);
	const onJoinTeamTime = useCallback(() => {
		setModalMode('join');
		setModalVisible(true);
	}, []);
	const onReload = useCallback(() => {
		dispatch(getUserMe({ id, user, token }));
	}, []);
	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
			<View style={[styles.view, { opacity: modalVisible ? 0.2 : 1 }]}>
				<NavigationHeader
					title="모임 목록"
					Left={() => (
						<Material
							name="reload"
							size={25}
							color={Colors.white}
							style={{ paddingTop: 1 }}
							onPress={onReload}
						/>
					)}
					Right={() => (
						<FontAweSome
							name="plus"
							size={22}
							color={Colors.white}
							style={{ paddingTop: 1 }}
							onPress={onMakeTeamTime}
						/>
					)}
				/>
				<Text style={styles.headerUnderText}>Plan list</Text>
				{!clubs && (
					<TouchableView
						style={[
							styles.teamListTouchableView,
							{ width: '100%', justifyContent: 'space-between' },
						]}
					>
						<View style={styles.rowCircle} />
						<Text style={styles.teamTitle}>아직 아무런 모임이 없네요 😭</Text>
					</TouchableView>
				)}
				<Spinner loading={loadingUserMe} />
				<FlatList
					style={{
						height: dimensions.screen.height * 0.55,
						flexGrow: 0,
					}}
					data={clubs}
					renderItem={({ item }) => (
						<TouchableView
							onPress={() => goTeamTime(item.name)}
							style={[
								styles.teamListTouchableView,
								{
									width: '100%',
									justifyContent: 'space-between',
									opacity: 1,
								},
							]}
						>
							<View
								style={[styles.rowCircle, { backgroundColor: item.color }]}
							/>
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={styles.teamTitle}
							>
								{item.name}
							</Text>
							<Icons size={15} name="right" style={styles.iconStyle} />
						</TouchableView>
					)}
					keyExtractor={(item, index) => String(item.id)}
				/>
				{/* <View
					style={[
						styles.blurView,
						{
							padding: dimensions.screen.width,
							backgroundColor: Colors.grey200,
							bottom: -10,
						},
					]}
				></View>
				<View
					style={[
						styles.blurView,
						{
							padding: dimensions.screen.width,
							backgroundColor: Colors.grey300,
							bottom: 0,
						},
					]}
				></View> */}
				{/* <View
					style={[styles.blurView, { padding: dimensions.screen.width }]}
				></View> */}
				<ModalInput
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
					user={user}
					id={id}
					token={token}
					goTeamTime={goTeamTime}
					modalMode={modalMode}
					setModalMode={setModalMode}
					loadingJoin={loadingJoin}
					postTeamError={postTeamError}
					joinTeamError={joinTeamError}
					joinUri={joinUri}
					loadingChangeColor={loadingChangeColor}
					joinName={joinName}
				/>
			</View>

			<TouchableView
				style={[styles.touchableView, { backgroundColor: '#017bff' }]}
				onPress={onJoinTeamTime}
			>
				<Text style={styles.loginText}>모임 참여</Text>
			</TouchableView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	view: { justifyContent: 'center', backgroundColor: Colors.white },
	headerUnderText: {
		fontFamily: 'NanumSquareR',
		fontSize: 16,
		marginTop: 13,
		marginBottom: 39,
		letterSpacing: -0.3,
		textAlign: 'center',
		backgroundColor: 'white',
	},

	text: {
		fontSize: 60,
		textAlign: 'center',
		marginBottom: 120,
		letterSpacing: -3,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	buttonUnderText: {
		marginTop: 12,
		fontSize: 12,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	loginText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 20,
		marginLeft: 10,
		color: Colors.white,
	},
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rowCircle: {
		// flexDirection: 'row',
		padding: 7,
		alignItems: 'flex-start',
		justifyContent: 'flex-end',

		backgroundColor: '#017bff',
		borderRadius: 20,
		position: 'absolute',
		top: 12,
		left: 40,
	},
	teamTitle: {
		fontSize: 15,
		fontFamily: 'SCDream4',
		color: '#000',
		position: 'absolute',
		letterSpacing: -0.5,
		left: 70,
		overflow: 'hidden',
		maxWidth: 230,
	},
	iconStyle: {
		position: 'absolute',
		right: 40,
	},
	textView: { width: '100%', padding: 5, marginBottom: 30 },
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 45,
		borderRadius: 10,
		width: '65%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',

		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		marginTop: 50,
		// position: 'absolute',
		// bottom: Platform.select({ ios: 10, android: 10 }), // -3-
		// marginBottom: 53,
	},
	teamListTouchableView: {
		flexDirection: 'row',
		height: 40,
		borderRadius: 10,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: 'white',
		shadowOffset: {
			width: 1,
			height: 1,
		},
	},
	blurView: {
		paddingTop: 5,
		paddingBottom: 10,
		opacity: 0.5,
		backgroundColor: Colors.grey200,
		position: 'absolute',
		bottom: 10,
		height: 30,
	},
});
