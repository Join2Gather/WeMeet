import React, { useCallback, useState, useEffect } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
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
} from '../store/timetable';
import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import { getUserMe } from '../store/login';
import individual, {
	checkHomeIstBlank,
	cloneINDates,
	initialIndividualTimetable,
	initialTimeMode,
	makePostHomeDates,
	postEveryTime,
	setInEndTime,
	setInStartTime,
} from '../store/individual';
import DatePicker from 'react-native-date-picker';
import { Spinner } from '.';
import { findTime } from '../interface';
import { useIsDarkMode } from '../hooks';
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
	const { isDark } = useIsDarkMode();
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
			console.log(checkTime);
			if (timeHour < checkTime.start) {
				initialWithError();
				Alert.alert('경고', '모임 시간 이전 시간으로 선택하실 수 없습니다', [
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
	const onPressEndConfirm = useCallback(
		(date) => {
			setSecond(false);
			setModalVisible && setModalVisible(false);
			setIsTimeMode && setIsTimeMode(false);
			setCurrent && setCurrent(0);
			const timeHour = date.getHours();
			const timeMinute = date.getMinutes();
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
			} else if (startTime.hour >= timeHour) {
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
						if (confirmCount === count) {
							setCurrent && setCurrent(3);
							setCount && setCount(1);
						} else {
							setCurrent && setCurrent(0);
							setCount && setCount((count) => count + 1);
						}
						dispatch(checkIsExist('end'));
						dispatch(changeConfirmTime());
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
		}
	}, [postDatesPrepare, uri, joinUri]);
	useEffect(() => {
		if (postConfirmSuccess || postHomeSuccess) {
			dispatch(getUserMe({ id, user, token }));
			dispatch(initialIndividualTimetable());
		}
	}, [postConfirmSuccess, postHomeSuccess]);
	useEffect(() => {
		dispatch(cloneINDates({ confirmClubs, confirmDatesTimetable }));
	}, [confirmClubs, confirmDatesTimetable]);
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
				androidVariant={'iosClone'}
				minuteInterval={10}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.black
							: Colors.white
						: Colors.black
				}
				title={
					isConfirm
						? findTime && findTime.length !== 0
							? `시작시간 설정\n 가능 시간 : [ ${findTime[0].timeText} ]`
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
					onPressEndConfirm(date);
				}}
				onDateChange={(date) => setDate(date)}
				onCancel={onPressClose}
				androidVariant={'iosClone'}
				minuteInterval={10}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.black
							: Colors.white
						: Colors.black
				}
				title={
					isConfirm
						? findTime && findTime.length !== 0
							? `종료시간 설정\n${findTime[0].timeText}`
							: ''
						: `시작 시간 : ${
								startTime.hour > 12 ? startTime.hour - 12 : startTime.hour
						  }시 : ${startTime.minute}분 \n종료시간 설정`
				}
				confirmText="확인"
				cancelText="취소"
			/>
		</>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 50,
	},
	modalView: {
		margin: 10,
		paddingBottom: 60,
		marginBottom: 60,
		backgroundColor: 'white',
		borderRadius: 13,
		padding: 15,
		alignItems: 'center',
		elevation: 10,
		shadowColor: 'black',
		shadowOffset: {
			width: 1,
			height: 0.3,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,

		width: '94%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginBottom: 18,
	},
	startTimeText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		fontSize: 17,
		marginBottom: 18,
	},
	textView: {
		width: '100%',
		//
	},
	hourText: {
		fontSize: 20,
		fontFamily: 'NanumSquareR',
		marginTop: 4,
	},
	textInput: {
		fontSize: 22,
		flex: 0.6,
		fontFamily: 'NanumSquareR',

		alignSelf: 'center',
		borderWidth: 0.3,
		padding: 2,
		textAlign: 'center',

		borderColor: Colors.blue300,
		borderRadius: 8,
	},
	textInputView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
	},
	buttonRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: 0,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	closeButtonStyle: {
		borderRadius: 8,

		padding: 12,
		flex: 1,
	},
	acceptButtonStyle: {
		padding: 15,

		borderRadius: 10,
	},
	modalText: {
		textAlign: 'center',
	},
	verticalLine: {
		borderLeftWidth: 0.16,
		width: 1,
	},
	viewFlex1: {
		flex: 0.1,
	},
});
