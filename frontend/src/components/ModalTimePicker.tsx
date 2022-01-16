import React, { useCallback, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeConfirmTime,
	makeConfirmDates,
	makePostIndividualDates,
	postIndividualTime,
	setEndHour,
	setEndMin,
	setStartMin,
	setStartHour,
	checkIsExist,
	checkIsBlank,
	makeInitialTimePicked,
	toggleIsInitial,
	setSelectIdx,
} from '../store/timetable';
import { Colors, useTheme } from 'react-native-paper';
import { RootState } from '../store';
import { getUserMe, toggleUserMeSuccess } from '../store/login';
import individual, {
	checkHomeIstBlank,
	cloneINDates,
	initialIndividualTimetable,
	initialTimeMode,
	makeHomeTime,
	makePostHomeDates,
	postEveryTime,
	setInEndTime,
	setInStartTime,
} from '../store/individual';
import DatePicker from 'react-native-date-picker';
import { Spinner } from '.';
import { findTime } from '../interface';
import { useIsDarkMode } from '../hooks';
import { useColorScheme } from 'react-native-appearance';
interface props {
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>> | null;
	mode?: string;
	setMode?: React.Dispatch<React.SetStateAction<string>>;
	setIsTimeMode?: React.Dispatch<React.SetStateAction<boolean>>;
	setCurrent?: React.Dispatch<React.SetStateAction<number>>;
	postDatesPrepare?: boolean;
	confirmDatesPrepare?: boolean;
	token: string;
	uri?: string;
	id: number;
	user: number;
	postIndividualDates: any;
	confirmDates: any;
	onPlusHour: (hour: number) => void;
	isConfirm?: boolean;
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	timeMode: string;
	joinUri: string;
	isHomeTime: boolean;
	findTime?: findTime[];
	count?: number;
	setCount?: React.Dispatch<React.SetStateAction<number>>;
}

export function ModalTimePicker({
	modalVisible,
	setModalVisible,
	mode,
	setMode,
	setIsTimeMode,
	setCurrent,
	postDatesPrepare,
	token,
	uri,
	user,
	id,
	postIndividualDates,
	isConfirm,
	date,
	setDate,
	timeMode,
	joinUri,
	isHomeTime,
	findTime,
	onPlusHour,
	count,
	setCount,
}: props) {
	const {
		postConfirmSuccess,
		confirmClubs,
		confirmDatesTimetable,
		isTimePicked,
		isTimeNoExist,
		isHomeTimePicked,
		postHomePrepare,
		everyTime,
		postHomeSuccess,
		startTimeText,
		startHour,
		endHour,
		confirmCount,
		selectIdx,
		userMeSuccess,
		isConfirmProve,
		inTimeColor,
	} = useSelector(({ timetable, login, individual }: RootState) => ({
		postConfirmSuccess: timetable.postConfirmSuccess,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		isTimeNoExist: timetable.isTimeNotExist,
		isTimePicked: timetable.isTimePicked,
		isHomeTimePicked: individual.isHomeTimePicked,
		postHomePrepare: individual.postHomePrepare,
		everyTime: individual.everyTime,
		postHomeSuccess: individual.postHomeSuccess,
		startTimeText: timetable.startTimeText,
		startHour: timetable.startHour,
		endHour: timetable.endHour,
		confirmCount: timetable.confirmCount,
		selectIdx: timetable.selectIdx,
		userMeSuccess: login.userMeSuccess,
		isConfirmProve: login.isConfirmProve,
		inTimeColor: login.inTimeColor,
	}));
	const dispatch = useDispatch();
	// const [minute, setMinute] = useState(0);
	// const [hour, setHour] = useState(0);

	const [checkTime, setCheck] = useState({
		start: 0,
		end: 0,
	});
	useEffect(() => {
		!isHomeTime &&
			setCheck((prev) => ({ ...prev, start: startHour, end: endHour }));
		isHomeTime && setCheck((prev) => ({ ...prev, start: 0, end: 24 }));
	}, [isHomeTime, startHour, endHour]);

	const [secondVisible, setSecond] = useState(false);
	const [firstVisible, setFirst] = useState(false);
	const [startTime, setStartTime] = useState({
		hour: 0,
		minute: 0,
	});

	const isDark = useColorScheme() === 'dark' ? true : false;

	useEffect(() => {
		if (modalVisible) setFirst(true);
	}, [modalVisible]);
	useEffect(() => {
		if (mode === 'loading') {
			//
			if (isHomeTime && !isHomeTimePicked) {
				dispatch(makePostHomeDates());
			} else {
				if (!isConfirm && !isTimePicked) {
					dispatch(makePostIndividualDates());
				} else if (isConfirm && !isTimeNoExist) {
					dispatch(makeConfirmDates());
				}
			}
			if (isTimeNoExist || isTimePicked || isHomeTimePicked) {
				setCurrent && setCurrent(0);
			}
			setTimeout(() => {
				setMode && setMode('normal');
			}, 500);
		}
	}, [
		mode,
		isConfirm,
		isTimeNoExist,
		isTimePicked,
		isHomeTime,
		isHomeTimePicked,
	]);
	const initialWithError = useCallback(() => {
		setCurrent && setCurrent(0);
		setIsTimeMode && setIsTimeMode(false);
		setMode && setMode('normal');
	}, []);
	const onPressConfirm = useCallback(
		(date) => {
			dispatch(makeInitialTimePicked());
			const timeHour = date.getHours();
			const timeMinute = date.getMinutes();
			setStartTime({
				hour: timeHour,
				minute: timeMinute,
			});
			onPlusHour(timeHour);
			setModalVisible && setModalVisible(false);
			if (isHomeTime)
				dispatch(setInStartTime({ hour: timeHour, min: timeMinute }));
			else {
				dispatch(setStartHour(timeHour));
				dispatch(setStartMin(timeMinute));
			}
			if (timeHour < checkTime.start) {
				initialWithError();
				Alert.alert('경고', '모임 시간 이전 시간으로 선택하실 수 없습니다', [
					{ text: '확인', onPress: () => {} },
				]);
			} else if (timeHour >= checkTime.end) {
				initialWithError();
				Alert.alert('경고', '모임 시간 이후 시간으로 선택하실 수 없습니다', [
					{ text: '확인', onPress: () => {} },
				]);
			} else {
				setCurrent && setCurrent(2);
				setMode && setMode('endMode');
				setTimeout(() => {
					setSecond(true);
				}, 100);
			}
		},
		[mode, isConfirm, date, modalVisible, isHomeTime, checkTime]
	);
	console.log(isDark);
	const onPressEndConfirm = useCallback(
		(date) => {
			setSecond(false);
			setFirst(false);
			setModalVisible && setModalVisible(false);
			setIsTimeMode && setIsTimeMode(false);
			setCurrent && setCurrent(0);
			const timeHour = date.getHours();
			const timeMinute = date.getMinutes();
			dispatch(setSelectIdx(0));
			if (isHomeTime)
				dispatch(setInEndTime({ hour: timeHour, min: timeMinute }));
			else {
				dispatch(setEndHour(timeHour));
				dispatch(setEndMin(timeMinute));
			}
			if (checkTime.end < timeHour) {
				initialWithError();
				Alert.alert('경고', '모임 시간 이후 시간으로 선택하실 수 없습니다', [
					{ text: '확인', onPress: () => {} },
				]);
			} else if (startTime.hour > timeHour) {
				initialWithError();
				Alert.alert('경고', '시작시간 전으로 시간 설정이 불가능 합니다', [
					{ text: '확인', onPress: () => {} },
				]);
			} else {
				if (isHomeTime) {
					dispatch(checkHomeIstBlank());
					setMode && setMode('loading');
				} else {
					if (isConfirm) {
						dispatch(checkIsExist('end'));
						dispatch(changeConfirmTime());
						if (confirmCount === count) {
							setCurrent && setCurrent(3);
							setCount && setCount(1);
						} else {
							setCurrent && setCurrent(0);
							setCount && setCount((count) => count + 1);
						}
					} else {
						dispatch(checkIsBlank('end'));
					}
					setMode && setMode('loading');
				}
			}
		},
		[isConfirm, isHomeTime, checkTime, startTime, count, confirmCount]
	);

	// 닫기 버튼
	const onPressClose = useCallback(() => {
		setFirst(false);
		setSecond(false);
		setModalVisible && setModalVisible(false);
		setIsTimeMode && setIsTimeMode(false);
		setCurrent && setCurrent(0);
		setMode && setMode('normal');
		dispatch(setSelectIdx(0));
		if (isHomeTime) {
			dispatch(initialTimeMode());
			initialWithError();
		}
	}, [setModalVisible, modalVisible, isHomeTime]);

	// 에브리 타임 시간 전송
	useEffect(() => {
		if (postHomePrepare) {
			dispatch(postEveryTime({ data: everyTime, id, token, user }));
			dispatch(initialTimeMode());
		}
	}, [postHomePrepare, everyTime]);
	// 개인 시간 전송
	useEffect(() => {
		if (postDatesPrepare && uri) {
			if (timeMode === 'make')
				dispatch(
					postIndividualTime({
						dates: postIndividualDates,
						id,
						token,
						uri: joinUri,
						user,
					})
				);
			else
				dispatch(
					postIndividualTime({
						dates: postIndividualDates,
						id,
						token,
						uri,
						user,
					})
				);
			// if (isConfirmProve) {
			// 	dispatch(getUserMe({ token }));
			// 	dispatch(initialIndividualTimetable());
			// }
		}
	}, [postDatesPrepare, uri, joinUri]);
	useEffect(() => {
		if (postConfirmSuccess || postHomeSuccess) {
			dispatch(getUserMe({ token }));
			dispatch(initialIndividualTimetable());
		}
	}, [postConfirmSuccess, postHomeSuccess]);

	useEffect(() => {
		if (userMeSuccess) {
			dispatch(makeHomeTime());
			dispatch(
				cloneINDates({ confirmClubs, confirmDatesTimetable, inTimeColor })
			);
		}
		setTimeout(() => {
			dispatch(toggleUserMeSuccess());
		}, 300);
	}, [userMeSuccess]);
	// useEffect(() => {
	// 	dispatch(cloneINDates({ confirmClubs, confirmDatesTimetable }));
	// }, []);
	return (
		<>
			<Spinner loading={mode} />
			<DatePicker
				modal
				open={firstVisible}
				date={date}
				mode="time"
				onConfirm={(date) => {
					setFirst(false);
					onPressConfirm(date);
				}}
				onDateChange={(date) => setDate(date)}
				onCancel={onPressClose}
				androidVariant={'nativeAndroid'}
				minuteInterval={10}
				style={{ backgroundColor: Colors.green100 }}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.white
							: Colors.black
						: Colors.black
				}
				title={
					isConfirm
						? findTime && findTime.length !== 0
							? `시작시간 설정\n ${findTime[selectIdx].timeText}`
							: ``
						: '시작시간 설정'
				}
				confirmText="확인"
				cancelText="취소"
			/>
			<DatePicker
				modal
				open={secondVisible}
				date={date}
				mode="time"
				onConfirm={(date) => {
					setSecond(false);
					setFirst(false);
					onPressEndConfirm(date);
				}}
				onDateChange={(date) => setDate(date)}
				onCancel={onPressClose}
				androidVariant={'nativeAndroid'}
				minuteInterval={10}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.white
							: Colors.black
						: Colors.black
				}
				title={
					isConfirm
						? findTime && findTime.length !== 0
							? `${findTime[selectIdx].timeText}`
							: ''
						: `종료시간 설정\n시작시간 : ${
								startTime.hour > 12 ? startTime.hour - 12 : startTime.hour
						  }시 ${startTime.minute}분`
				}
				confirmText="확인"
				cancelText="취소"
			/>
		</>
	);
}
