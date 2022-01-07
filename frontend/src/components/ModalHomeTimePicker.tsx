import React, { useCallback, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import DatePicker from 'react-native-date-picker';
import { useIsDarkMode } from '../hooks';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { setAppLoading, setHomeTime } from '../store/login';
import { cloneDates } from '../store/timetable';
import { cloneINDates } from '../store/individual';
dayjs.locale('ko');
interface props {
	homeVisible: boolean;
	setHomeVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setSettingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalHomeTimePicker({ homeVisible, setHomeVisible }: props) {
	const { alarmArray, confirmClubs, confirmDatesTimetable } = useSelector(
		({ timetable, login }: RootState) => ({
			alarmArray: timetable.alarmArray,

			confirmClubs: login.confirmClubs,
			confirmDatesTimetable: login.confirmDatesTimetable,
		})
	);
	const dispatch = useDispatch();
	// const [minute, setMinute] = useState(0);
	// const [hour, setHour] = useState(0);
	const [date, setDate] = useState(dayjs().set('h', 9).set('m', 0).toDate());
	const [secondDate, setSecondDate] = useState(
		dayjs().set('h', 22).set('m', 0).toDate()
	);
	const [loading, setLoading] = useState('');

	const onPressClose = useCallback(() => {
		setFirst(false);
		setSecond(false);
		setHomeVisible(false);
	}, []);

	// const add = MakeAlarm()
	const [secondVisible, setSecond] = useState(false);
	const [firstVisible, setFirst] = useState(false);

	const [today] = useState(dayjs().format('YYYY-MM-DD'));

	useEffect(() => {}, [alarmArray]);

	useEffect(() => {
		if (homeVisible) setFirst(true);
	}, [homeVisible]);
	const { isDark } = useIsDarkMode();

	const onPressFirstConfirm = useCallback((date) => {
		setDate(date);
		const start = date.getHours();
		setTimeout(() => {
			setSecond(true);
		}, 100);
	}, []);
	const onPressSecondConfirm = useCallback(
		(second) => {
			const start = date.getHours();

			let end = second.getHours();
			if (end === 0) {
				end = 24;
			}
			if (end < start) {
				Alert.alert('경고', '종료 시간이 시작 시간보다 작을 수 없습니다', [
					{ text: '확인' },
				]);
			} else {
				dispatch(cloneDates({ start: start, end: end }));
				dispatch(setHomeTime({ start: start, end: end }));
			}
			setTimeout(() => {
				dispatch(cloneINDates({ confirmClubs, confirmDatesTimetable }));
			}, 100);
			dispatch(setAppLoading('loading'));
			setTimeout(() => dispatch(setAppLoading('')), 500);
			setSecond(false);

			setHomeVisible(false);
		},
		[date, confirmClubs, confirmDatesTimetable]
	);
	return (
		<>
			<DatePicker
				modal
				open={firstVisible}
				date={date}
				mode="time"
				onConfirm={(date) => {
					setFirst(false);
					onPressFirstConfirm(date);
				}}
				onDateChange={(date) => setDate(date)}
				onCancel={onPressClose}
				androidVariant={'iosClone'}
				minuteInterval={30}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.black
							: Colors.white
						: Colors.black
				}
				title={`시작 시간 설정`}
				confirmText="확인"
				cancelText="취소"
			/>
			<DatePicker
				modal
				open={secondVisible}
				date={secondDate}
				mode="time"
				onConfirm={(date) => {
					setSecond(false);
					onPressSecondConfirm(date);
				}}
				onDateChange={(date) => setSecondDate(date)}
				onCancel={onPressClose}
				androidVariant={'iosClone'}
				minuteInterval={30}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.black
							: Colors.white
						: Colors.black
				}
				title={`종료 시간 설정`}
				confirmText="확인"
				cancelText="취소"
			/>
		</>
	);
}
