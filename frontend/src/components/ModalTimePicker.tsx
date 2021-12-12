import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeConfirmTime,
	postSnapShot,
	makeConfirmDates,
	makePostIndividualDates,
	postConfirm,
	postIndividualTime,
	setEndHour,
	setEndMin,
	setStartMin,
	setStartHour,
	checkIsExist,
	checkIsBlank,
	toggleTimePick,
	makeInitialTimePicked,
} from '../store/timetable';
import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import { getUserMe } from '../store/login';
import { cloneINDates, initialIndividualTimetable } from '../store/individual';
import DatePicker from 'react-native-date-picker';
import { Spinner } from '.';
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

	isConfirm?: boolean;
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
	timeMode: string;
	joinUri: string;
}

export function ModalTimePicker({
	modalVisible,
	setModalVisible,
	mode,
	setMode,
	setIsTimeMode,
	setCurrent,
	postDatesPrepare,
	confirmDatesPrepare,
	token,
	uri,
	user,
	id,
	postIndividualDates,
	confirmDates,
	isConfirm,
	date,
	setDate,
	timeMode,
	joinUri,
}: props) {
	const {
		postConfirmSuccess,
		confirmClubs,
		confirmDatesTimetable,
		isTimePicked,
		isTimeNoExist,
	} = useSelector(({ timetable, login, team }: RootState) => ({
		postConfirmSuccess: timetable.postConfirmSuccess,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		isTimeNoExist: timetable.isTimeNotExist,
		isTimePicked: timetable.isTimePicked,
	}));
	const dispatch = useDispatch();
	// const [minute, setMinute] = useState(0);
	// const [hour, setHour] = useState(0);
	const [secondVisible, setSecond] = useState(false);
	const [firstVisible, setFirst] = useState(false);

	useEffect(() => {
		if (modalVisible) setFirst(true);
	}, [modalVisible]);
	useEffect(() => {
		if (mode === 'loading') {
			if (!isConfirm && !isTimePicked) {
				dispatch(makePostIndividualDates());
			} else if (isConfirm && !isTimeNoExist) {
				dispatch(makeConfirmDates());
			}
			if (isTimeNoExist || isTimePicked) {
				setCurrent && setCurrent(0);
			}
			setTimeout(() => {
				setMode && setMode('normal');
			}, 500);
		}
	}, [mode, isConfirm, isTimeNoExist, isTimePicked]);
	const onPressEndConfirm = useCallback(
		(date) => {
			setSecond(false);
			setModalVisible && setModalVisible(false);
			setIsTimeMode && setIsTimeMode(false);
			setCurrent && setCurrent(0);
			const timeHour = date.getHours();
			const timeMinute = date.getMinutes();
			dispatch(setEndHour(timeHour));
			dispatch(setEndMin(timeMinute));
			if (isConfirm) {
				dispatch(checkIsExist('end'));
				dispatch(changeConfirmTime());
				setCurrent && setCurrent(3);
				setMode && setMode('loading');
			} else {
				dispatch(checkIsBlank('end'));
				setMode && setMode('loading');
			}
		},
		[isConfirm]
	);

	const onPressConfirm = useCallback(
		(date) => {
			dispatch(makeInitialTimePicked());
			const timeHour = date.getHours();
			const timeMinute = date.getMinutes();
			setCurrent && setCurrent(2);
			// setHour(date.getHours());
			// setMinute(date.getMinutes());
			setModalVisible && setModalVisible(false);
			dispatch(setStartHour(timeHour));
			dispatch(setStartMin(timeMinute));
			setMode && setMode('endMode');
			setTimeout(() => {
				setSecond(true);
			}, 100);
		},
		[mode, isConfirm, date, modalVisible]
	);

	// 닫기 버튼
	const onPressClose = useCallback(() => {
		setFirst(false);
		setSecond(false);
		setModalVisible && setModalVisible(false);
		setIsTimeMode && setIsTimeMode(false);
		setCurrent && setCurrent(0);
		setMode && setMode('normal');
	}, [setModalVisible, modalVisible]);
	// 이전 모드
	const onPressPrevMode = useCallback(() => {
		setMode && setMode('startMinute');
		// setModalVisible(false);
	}, []);
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
	}, [
		postDatesPrepare,
		uri,
		postIndividualDates,
		id,
		token,
		user,
		confirmDates,
		joinUri,
		timeMode,
	]);
	useEffect(() => {
		if (postConfirmSuccess) {
			dispatch(getUserMe({ id, user, token }));
			dispatch(initialIndividualTimetable());
		}
	}, [postConfirmSuccess]);
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
				minuteInterval={5}
				title="시작 시간 설정"
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
				minuteInterval={5}
				title="종료 시간 설정"
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
