/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	StyleSheet,
	FlatList,
	Platform,
	Image,
	ScrollView,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
NavigationHeader, MaterialCommunityIcon as Icon, Text} from '../theme';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation, Spinner, ModalSelect } from '../components';
import { Timetable } from '../components/Timetable';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
	cloneINDates,
	cloneIndividualDates,
	postImage,
} from '../store/individual';
import * as FileSystem from 'expo-file-system';
import { useMakeTimetable } from '../hooks';
import { getUserMe } from '../store/login';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { HomeSetting } from '../components/HomeSetting';
import { Sequence } from '../components/Sequence';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { setIsInTeamTime } from '../store/timetable';
export default function Home() {
	const {
		token,
		individualDates,
		loginEveryTime,
		postEveryTime,
		id,
		user,
		userMeSuccess,
		confirmClubs,
		confirmDatesTimetable,
		individualTimesText,
		individualColor,
		myNickName,
		joinClubNum,
		confirmClubNum,
	} = useSelector(({ login, individual, loading }: RootState) => ({
		token: login.token,
		id: login.id,
		user: login.user,
		individualDates: individual.individualDates,
		loginEveryTime: loading['individual/LOGIN_EVERYTIME'],
		postEveryTime: loading['individual/POST_EVERYTIME'],
		userMeSuccess: login.userMeSuccess,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		individualTimesText: individual.individualTimesText,
		individualColor: login.individualColor,
		myNickName: login.nickname,
		joinClubNum: login.joinClubNum,
		confirmClubNum: login.confirmClubNum,
	}));
	const dispatch = useDispatch();
	const { defaultDates } = useMakeTimetable();
	const navigation = useNavigation();
	useEffect(() => {
		const isFocus = navigation.getState().routes;
		console.log(isFocus);
	}, [navigation]);
	useEffect(() => {
		if (!individualDates.length) {
		}
		dispatch(cloneIndividualDates(defaultDates));
	}, []);
	useEffect(() => {
		dispatch(getUserMe({ id, token, user }));
	}, []);
	useEffect(() => {
		dispatch(cloneINDates({ confirmClubs, confirmDatesTimetable }));
	}, [confirmClubs, confirmDatesTimetable]);
	// navigation

	const [scrollEnabled] = useScrollEnabled();
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectModalVisible, setSelectModalVisible] = useState(false);
	const [settingModalVisible, setSettingModalVisible] = useState(false);
	const flatListRef = useRef<FlatList | null>(null);

	// image pic1er
	const [image, setImage] = useState(null);
	const [mode, setMode] = useState('normal');
	const [isTimeMode, setIsTimeMode] = useState(false);
	const [currentNumber, setCurrent] = useState(0);
	const [sequence, setSequence] = useState([0, 1, 2]);
	const onPressPlus = useCallback(() => {
		setIsTimeMode(true);
		setMode('startMode');
	}, []);

	useEffect(() => {
		!userMeSuccess && setSettingModalVisible(true);
	}, [userMeSuccess]);

	// modal

	// useEffect(() => {
	// 	(async () => {
	// 		if (Platform.OS !== 'web') {
	// 			const { status } =
	// 				await ImagePicker.requestMediaLibraryPermissionsAsync();
	// 			if (status !== 'granted') {
	// 				alert('카메라 권한을 승인해주세요');
	// 			}
	// 		}
	// 	})();
	// }, []);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			const imagePath = result.uri;
			const imageExt = result.uri.split('.').pop();
			const imageMime = `image/${imageExt}`;
			dispatch(postImage({ image: imagePath, token: token }));
		}
	};

	return (
		<SafeAreaView style={{ backgroundColor: individualColor }}>
			<View style={[styles.view]}>
				<NavigationHeader
					title="내 일정 등록하기"
					headerColor={individualColor}
					Left={() => (
						<TouchableHighlight
							underlayColor={individualColor}
							onPress={() => setSelectModalVisible(true)}
						>
							<Icon
								name="timetable"
								size={25}
								color={Colors.white}
								style={{ paddingTop: 1 }}
							/>
						</TouchableHighlight>
					)}
					Right={() => (
						<TouchableHighlight
							underlayColor={individualColor}
							onPress={onPressPlus}
						>
							<FontAwesome5Icon
								name="plus"
								size={22}
								color={Colors.white}
								style={{ paddingTop: 2 }}
							/>
						</TouchableHighlight>
					)}
					secondRight={() => (
						<TouchableHighlight
							underlayColor={individualColor}
							onPress={() => setSettingModalVisible(true)}
						>
							<MaterialIcon
								name="settings"
								size={24}
								color={Colors.white}
								style={{ paddingTop: 1 }}
							/>
						</TouchableHighlight>
					)}
				/>

				<View style={styles.viewHeight}>
					<Spinner loading={postEveryTime} />
					{mode === 'normal' && (
						<View style={{ flexDirection: 'column' }}>
							<Text style={styles.titleText}>안녕하세요 {myNickName}님</Text>
							<View style={styles.rowView}>
								<>
									<View
										style={[
											styles.boxView,
											{ backgroundColor: individualColor },
										]}
									/>
									<Text style={styles.infoText}>모임 일정</Text>
									<View
										style={[
											styles.boxView,
											{ backgroundColor: Colors.grey300 },
										]}
									/>
									<Text style={styles.infoText}>개인 일정</Text>
									<View
										style={[styles.boxView, { backgroundColor: Colors.white }]}
									/>
									<Text style={styles.infoText}>비어있는 일정</Text>
								</>
							</View>
						</View>
					)}
					{isTimeMode && (
						<View style={{ flexDirection: 'column' }}>
							<View style={{ height: 30 }} />
							<Sequence
								color={individualColor}
								currentNumber={currentNumber}
								mode={sequence}
							/>
							{mode === 'startMode' && (
								<>
									<Text style={styles.stepText}>
										일정 시작 시간을 터치해주세요
									</Text>
								</>
							)}

							{mode === 'startMinute' && (
								<>
									<Text style={styles.stepText}>일정 시작 분 설정</Text>
								</>
							)}
							{mode === 'endMode' && (
								<>
									<Text style={styles.stepText}>종료 시간 입력해주세요</Text>
								</>
							)}
						</View>
					)}
				</View>
				<ScrollView style={{ backgroundColor: Colors.white }}>
					<Timetable
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						mode={mode}
						setMode={setMode}
						setIsTimeMode={setIsTimeMode}
						individualDates={individualDates}
						isGroup={false}
						individualTimesText={individualTimesText}
						endIdx={25}
						color={individualColor}
						isHomeTime={true}
						setCurrent={setCurrent}
					/>
					<ModalSelect
						selectModalVisible={selectModalVisible}
						setSelectModalVisible={setSelectModalVisible}
					/>
					<HomeSetting
						userMeSuccess={userMeSuccess}
						setSettingModalVisible={setSettingModalVisible}
						settingModalVisible={settingModalVisible}
						user={user}
						id={id}
						token={token}
						color={individualColor}
						myNickName={myNickName}
						joinClubNum={joinClubNum}
						confirmClubNum={confirmClubNum}
					/>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		marginTop: 20,
	},
	viewHeight: {
		height: 110,
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		letterSpacing: -1,
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
		height: 40,
		marginTop: 20,
		textAlign: 'center',
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.3,
		marginTop: 1,
	},
	titleText: {
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		marginTop: 25,
		letterSpacing: -1,
		height: 25,
	},
});
