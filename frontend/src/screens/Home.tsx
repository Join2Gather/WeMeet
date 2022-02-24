/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	StyleSheet,
	FlatList,
	Platform,
	ScrollView,
	Animated,
	RefreshControl
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import Constants from 'expo-constants';
// prettier-ignore
import {SafeAreaView, View,
NavigationHeader, MaterialCommunityIcon as Icon, Text, TouchHeaderIconView} from '../theme';
import { useScrollEnabled } from '../contexts';
import {
	Spinner,
	DayOfWeek,
	ModalHomeTimePicker,
	ModalHomeInfo
} from '../components';
import { Timetable } from '../components/Timetable';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
	cloneINDates,
	cloneIndividualDates,
	initialIndividualTimetable,
	setEveryTimeData
} from '../store/individual';
import { useAnimatedValue } from '../hooks';
import { getUserMe } from '../store/login';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { HomeSetting } from '../components/HomeSetting';
import { Sequence } from '../components/Sequence';
import Ionic from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import * as Notifications from 'expo-notifications';

const iconSize = 22;

// export async function allowsNotificationsAsync() {
// 	const settings = await Notifications.getPermissionsAsync();
// 	return (
// 		settings.granted ||
// 		settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
// 	);
// }
async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } =
			await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	} else {
		alert('Must use physical device for Push Notifications');
	}

	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C'
		});
	}

	return token;
}
export default function Home() {
	const {
		token,
		individualDates,
		inTimeColor,
		id,
		user,
		userMeSuccess,
		confirmClubs,
		confirmDatesTimetable,
		individualTimesText,
		inThemeColor,
		userMeError,
		individualCount,
		groupCount,
		endHour,
		appLoading,
		seeTips,
		isViewError,
		everyTime
	} = useSelector(({ login, individual, loading }: RootState) => ({
		token: login.token,
		id: login.id,
		user: login.user,
		individualDates: individual.individualDates,
		inTimeColor: login.inTimeColor,
		userMeSuccess: login.userMeSuccess,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		individualTimesText: individual.individualTimesText,
		inThemeColor: login.inThemeColor,
		userMeError: individual.error,
		individualCount: individual.individualCount,
		groupCount: individual.groupCount,
		endHour: login.homeTime.end,
		appLoading: login.loading,
		seeTips: login.seeTips,
		isViewError: login.viewError,
		everyTime: login.everyTime
	}));

	// useEffect(() => {
	// 	allowsNotificationsAsync();
	// 	registerForPushNotificationsAsync();
	// 	Notifications.scheduleNotificationAsync({
	// 		content: {
	// 			title: "Time's up!",
	// 			body: 'Change sides!',
	// 		},
	// 		trigger: {
	// 			seconds: 1, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
	// 		},
	// 	});
	// }, []);
	const dispatch = useDispatch();

	const navigation = useNavigation();

	// useEffect(() => {
	// 	if (!individualDates.length) {
	// 	}
	// }, []);
	useEffect(() => {
		dispatch(getUserMe({ token }));
		setTimeout(() => {
			dispatch(setEveryTimeData(everyTime));
		}, 1000);
	}, []);
	useEffect(() => {
		dispatch(
			cloneINDates({ confirmClubs, confirmDatesTimetable, inTimeColor })
		);
	}, [confirmClubs, confirmDatesTimetable]);
	// navigation

	const [scrollEnabled] = useScrollEnabled();
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectModalVisible, setSelectModalVisible] = useState(false);
	const [settingModalVisible, setSettingModalVisible] = useState(false);
	const [infoVisible, setInfoVisible] = useState(false);
	const flatListRef = useRef<FlatList | null>(null);

	useEffect(() => {
		seeTips ? setInfoVisible(true) : setInfoVisible(false);
	}, [seeTips]);
	// image pic1er
	const [refreshing, setRefreshing] = useState(false);
	const [mode, setMode] = useState('normal');
	const [isTimeMode, setIsTimeMode] = useState(false);
	const [currentNumber, setCurrent] = useState(0);
	const [sequence, setSequence] = useState([0, 1, 2]);
	const [homeVisible, setHomeVisible] = useState(false);

	const [headerShown, setHeaderShown] = useState(true);
	const animValue = useAnimatedValue(115);

	useEffect(() => {
		Animated.timing(animValue, {
			toValue: headerShown ? 0 : -115,
			duration: 250,
			useNativeDriver: true
		}).start();
	}, [headerShown]);

	useEffect(() => {
		userMeError && setSettingModalVisible(true);
	}, [userMeError]);
	const onPressPlusBtn = useCallback(() => {
		setIsTimeMode(true);
		setMode('startMode');
	}, []);
	// modal

	const openDrawer = useCallback(() => {
		navigation.dispatch(DrawerActions.openDrawer());
	}, []);

	const onPressChangeTime = useCallback(() => {
		setSettingModalVisible(false);
		setHomeVisible(true);
	}, []);

	const onScrollForRefresh = useCallback(() => {
		setRefreshing(true);
		dispatch(initialIndividualTimetable());
		dispatch(getUserMe({ token }));
		setTimeout(() => setRefreshing(false), 1000);
	}, [token]);
	return (
		<SafeAreaView style={{ backgroundColor: inThemeColor }}>
			<View style={[styles.view]}>
				<StatusBar style="light" />
				<NavigationHeader
					title="내 일정 등록하기"
					headerColor={inThemeColor}
					Left={() => (
						<TouchHeaderIconView
							underlayColor={inThemeColor}
							onPress={openDrawer}
						>
							<Ionic
								name="menu"
								size={iconSize + 11}
								color={Colors.white}
								// style={{ paddingTop: 1 }}
							/>
						</TouchHeaderIconView>
					)}
					Right={() => (
						<TouchHeaderIconView
							underlayColor={inThemeColor}
							onPress={onPressPlusBtn}
						>
							<FontAwesome5Icon
								name="plus"
								size={iconSize}
								color={Colors.white}
								style={{}}
							/>
						</TouchHeaderIconView>
					)}
					secondRight={() => (
						<TouchHeaderIconView
							underlayColor={inThemeColor}
							onPress={() => setSettingModalVisible(true)}
						>
							<MaterialIcon
								name="settings"
								size={iconSize + 2}
								color={Colors.white}
							/>
						</TouchHeaderIconView>
					)}
					thirdRight={() => (
						<TouchHeaderIconView
							underlayColor={inThemeColor}
							onPress={() => setInfoVisible(true)}
						>
							<FontAwesome5Icon
								name="question-circle"
								size={iconSize}
								color={Colors.white}
								style={{ paddingTop: 1 }}
							/>
						</TouchHeaderIconView>
					)}
				/>

				<View style={styles.viewHeight}>
					{mode === 'normal' && (
						<View style={{ flexDirection: 'column' }}>
							{/* <Text style={styles.titleText}>안녕하세요 {myNickName}님</Text> */}
							{groupCount !== 0 && individualCount !== 0 && (
								<>
									<Text style={styles.titleText}>
										오늘은 {individualCount}개의 개인 일정과 {groupCount}
										개의 팀 일정이 있어요
									</Text>
								</>
							)}
							{groupCount !== 0 && individualCount === 0 && (
								<Text style={styles.titleText}>
									오늘은 {groupCount}개의 팀 일정이 있어요
								</Text>
							)}
							{!groupCount && individualCount !== 0 && (
								<Text style={styles.titleText}>
									오늘은 {individualCount}개의 개인 일정이 있어요
								</Text>
							)}
							{!groupCount && individualCount === 0 && (
								<Text style={styles.titleText}>
									오늘은 아무런 일정이 없네요
								</Text>
							)}
							<View style={styles.rowView}>
								<>
									<View style={[styles.boxView]}>
										<View style={{ flex: 1, backgroundColor: Colors.red500 }} />
										<View
											style={{ flex: 1, backgroundColor: Colors.orange500 }}
										/>
										<View
											style={{ flex: 1, backgroundColor: Colors.yellow500 }}
										/>
										<View
											style={{ flex: 1, backgroundColor: Colors.green500 }}
										/>
										<View
											style={{ flex: 1, backgroundColor: Colors.blue500 }}
										/>
									</View>
									<Text style={styles.infoText}>모임 일정</Text>
									<View
										style={[styles.boxView, { backgroundColor: inTimeColor }]}
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
					<Spinner loading={appLoading} />
					{isTimeMode && (
						<View style={{ flexDirection: 'column' }}>
							<View style={{ height: 30 }} />
							<Sequence
								color={inThemeColor}
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
				<DayOfWeek isTeam={false} />
				<ScrollView
					style={{ backgroundColor: Colors.white }}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onScrollForRefresh}
						/>
					}
				>
					<Timetable
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						mode={mode}
						setMode={setMode}
						setIsTimeMode={setIsTimeMode}
						individualDates={individualDates}
						isGroup={false}
						individualTimesText={individualTimesText}
						endIdx={endHour}
						color={inThemeColor}
						isHomeTime={true}
						setCurrent={setCurrent}
					/>
					<ModalHomeTimePicker
						homeVisible={homeVisible}
						setHomeVisible={setHomeVisible}
						setSettingModalVisible={setSettingModalVisible}
					/>
					<HomeSetting
						userMeError={userMeError}
						setSettingModalVisible={setSettingModalVisible}
						settingModalVisible={settingModalVisible}
						user={user}
						id={id}
						token={token}
						color={inThemeColor}
						inTimeColor={inTimeColor}
						onPressChangeTime={onPressChangeTime}
						isViewError={isViewError}
					/>
					<ModalHomeInfo
						infoVisible={infoVisible}
						setInfoVisible={setInfoVisible}
						seeTips={seeTips}
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
		marginTop: 25
	},
	viewHeight: {
		height: 115
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		letterSpacing: -1
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
		height: 40,
		marginTop: 20,
		textAlign: 'center'
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.5,
		// marginTop: 1,
		flexDirection: 'column'
	},
	titleText: {
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		marginTop: 25,
		letterSpacing: -1,
		height: 25
	}
});
