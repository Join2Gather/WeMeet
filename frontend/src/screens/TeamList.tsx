import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
	SafeAreaView,
	TouchableView,
	TopBar,
	MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import Icons from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { initialError, setModalMode } from '../store/team';
import { ModalInput, Spinner } from '../components';
import { NavigationHeader } from '../theme';
import FontAweSome from 'react-native-vector-icons/FontAwesome5';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { findTeam, getUserMe } from '../store/login';
import { Colors } from 'react-native-paper';
import { makeTeamTime, setIsInTeamTime, setTeamName } from '../store/timetable';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { hexToRGB } from '../lib/util/hexToRGB';
import { TouchableHighlight } from 'react-native-gesture-handler';
const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
const circleWidth = 14;
export default function TeamList() {
	const {
		user,
		id,
		clubs,
		token,
		loginURI,
		loginName,
		joinTeam,
		joinName,
		postTeamError,
		joinTeamError,
		loadingJoin,
		loadingChangeColor,
		teamColor,
		teamName,
		teamUri,
		teamMakeColor,
		joinUri,
		loadingUserMe,
		makeReady,
		modalMode,
		color,
		peopleCount,
		startHour,
		endHour,
		makeStartHour,
		makeEndHour,
		individualColor,
	} = useSelector(({ login, team, loading, timetable }: RootState) => ({
		user: login.user,
		id: login.id,
		clubs: login.clubs,
		token: login.token,
		loginURI: login.uri,
		loginName: login.name,
		joinTeam: team.joinTeam,
		joinName: team.joinName,
		joinTeamError: team.joinTeamError,
		postTeamError: team.postTeamError,
		loadingJoin: loading['team/JOIN_TEAM'],
		loadingChangeColor: loading['team/CHANGE_COLOR'],
		teamColor: timetable.color,
		teamMakeColor: team.teamColor,
		teamName: team.name,
		teamUri: team.joinUri,
		joinUri: team.joinUri,
		loadingUserMe: loading['login/USER_ME'],
		makeReady: timetable.makeReady,
		modalMode: team.modalMode,
		color: login.color,
		peopleCount: login.peopleCount,
		startHour: login.startHour,
		endHour: login.endHour,
		makeStartHour: team.startHour,
		makeEndHour: team.endHour,
		individualColor: login.individualColor,
	}));

	const [sequence, setSequence] = useState([0, 1, 2, 3]);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('initial');
	const [makeName, setMake] = useState('');
	const navigation = useNavigation();
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});
	const dispatch = useDispatch();

	// useEffect
	useEffect(() => {
		dispatch(getUserMe({ id, token, user }));
	}, [joinTeam]);
	useEffect(() => {
		const result = hexToRGB(individualColor);
		result && setRGBColor(result);
	}, [individualColor]);
	useEffect(() => {
		dispatch(setModalMode('normal'));
	}, [joinTeamError]);
	// useCallback
	// Navigation 이동
	useEffect(() => {
		if (mode === 'next') {
			if (modalMode === 'make') {
				dispatch(
					makeTeamTime({
						color: teamMakeColor,
						peopleCount: 1,
						startHour: makeStartHour,
						endHour: makeEndHour,
					})
				);
				dispatch(setTeamName({ name: teamName, uri: teamUri }));

				setTimeout(() => {
					navigation.navigate('TeamTime', {
						user,
						id,
						token,
						modalMode,
					});
				}, 50);
				setMode('normal');
			} else if (modalMode === 'join') {
				dispatch(
					makeTeamTime({
						color: teamMakeColor,
						peopleCount,
						startHour,
						endHour,
					})
				);
				dispatch(setTeamName({ name: loginName, uri: loginURI }));
			} else {
				dispatch(
					makeTeamTime({
						color,
						peopleCount,
						startHour,
						endHour,
					})
				);
				dispatch(setTeamName({ name: loginName, uri: loginURI }));
			}

			setTimeout(() => {
				navigation.navigate('TeamTime', {
					user,
					id,
					token,
					modalMode,
				});
			}, 50);
			setMode('normal');

			dispatch(setIsInTeamTime(true));
		}
	}, [modalMode, mode, teamMakeColor, makeStartHour, makeEndHour]);
	const goTeamTime = useCallback(
		(name?: string, uri?: string) => {
			if (modalMode === 'join') {
				dispatch(findTeam({ uri }));
				setMode('next');
			} else if (modalMode === 'normal') {
				dispatch(findTeam({ name }));
				setMode('next');
			} else if (modalMode === 'make') {
				name && setMake(name);
				setMode('next');
			}

			dispatch(initialError());
		},
		[modalMode]
	);
	// 모달 모드 분리
	const onMakeTeamTime = useCallback(() => {
		if (sequence.length !== 4) setSequence((sequence) => [...sequence, 3]);
		dispatch(setModalMode('make'));
		setModalVisible(true);
	}, [sequence]);
	const onJoinTeamTime = useCallback(() => {
		setSequence((sequence) => sequence.filter((idx) => idx !== 3));
		dispatch(setModalMode('join'));
		setModalVisible(true);
	}, [sequence]);
	const onReload = useCallback(() => {
		dispatch(getUserMe({ id, user, token }));
	}, []);
	return (
		<SafeAreaView
			style={{ backgroundColor: modalVisible ? Colors.white : individualColor }}
		>
			<View
				style={[
					styles.view,
					{ opacity: modalVisible ? 0.2 : 1, backgroundColor: Colors.white },
				]}
			>
				<NavigationHeader
					title="모임 목록"
					headerColor={individualColor}
					Left={() => (
						<TouchableHighlight
							underlayColor={individualColor}
							onPress={onReload}
						>
							<FontAwesome5Icon
								name="redo-alt"
								size={22}
								color={Colors.white}
								style={{ paddingTop: 1 }}
							/>
						</TouchableHighlight>
					)}
					Right={() => (
						<TouchableHighlight
							underlayColor={individualColor}
							onPress={onMakeTeamTime}
						>
							<FontAwesome5Icon
								name="plus"
								size={22}
								color={Colors.white}
								style={{ paddingTop: 1 }}
							/>
						</TouchableHighlight>
					)}
				/>
				{/* <Spinner loading={userLoading} /> */}
				<Text style={[styles.headerUnderText]}>Plan list</Text>

				{!clubs.length && (
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
				{/* <Spinner loading={loadingUserMe} /> */}
				<FlatList
					style={styles.FlatView}
					data={clubs}
					renderItem={({ item }) => (
						<View>
							<TouchableHighlight
								onPress={() => goTeamTime(item.name)}
								activeOpacity={0.1}
								underlayColor={Colors.grey300}
								style={[
									styles.teamListTouchableView,
									{
										opacity: 1,
									},
								]}
							>
								<View style={styles.teamView}>
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
								</View>
							</TouchableHighlight>
						</View>
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
					loadingJoin={loadingJoin}
					postTeamError={postTeamError}
					joinTeamError={joinTeamError}
					joinUri={joinUri}
					loadingChangeColor={loadingChangeColor}
					joinName={joinName}
					makeReady={makeReady}
					individualColor={individualColor}
					sequence={sequence}
				/>
				<TouchableView
					style={[
						styles.touchableView,
						{
							backgroundColor: `rgba(${RGBColor.r}, ${RGBColor.g}, ${RGBColor.b}, 2)`,
						},
					]}
					onPress={onJoinTeamTime}
				>
					<Text style={styles.loginText}>모임 참여</Text>
				</TouchableView>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	view: { justifyContent: 'center', backgroundColor: Colors.white },
	headerUnderText: {
		fontFamily: 'NanumSquareR',
		fontSize: 16,
		marginTop: 15,
		marginBottom: 20,
		letterSpacing: -0.3,

		textAlign: 'center',
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
		width: circleWidth,
		height: circleWidth,
		borderRadius: circleWidth / 2,
		// position: 'absolute',
		marginLeft: '10%',
		// top: -7,
	},
	teamTitle: {
		fontSize: 13,
		fontFamily: 'SCDream4',
		color: '#000',
		position: 'absolute',
		letterSpacing: -0.5,
		left: '18%',
		overflow: 'hidden',
		textAlign: 'center',
	},
	iconStyle: {
		position: 'absolute',
		right: '10%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
	},
	textView: { width: '100%', padding: 5, marginBottom: 30 },
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 50,
		marginBottom: 50,
		borderRadius: 10,
		width: '65%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: Colors.white,
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		marginTop: 50,
	},
	teamListTouchableView: {
		flexDirection: 'row',
		height: 40,
		// borderRadius: 10,
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
	FlatView: {
		height: '70%',
		flexGrow: 0,
	},
	teamView: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
});
