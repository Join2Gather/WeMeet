import React, { useCallback, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';

import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import DatePicker from 'react-native-date-picker';
import MakeAlarm from '../lib/util/MakeAlarm';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useColorScheme } from 'react-native-appearance';
dayjs.locale('ko');
interface props {
	dateVisible: boolean;
	setDateVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setSettingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	name: string;
	alarmTime: number;
	setSetting: React.Dispatch<React.SetStateAction<string>>;
	setSubMode: React.Dispatch<React.SetStateAction<string>>;
}

export function ModalDatePicker({
	dateVisible,
	setDateVisible,
	name,
	alarmTime,
	setSetting,
	setSubMode,
	setSettingModalVisible
}: props) {
	const { alarmArray, color } = useSelector(
		({ timetable, login }: RootState) => ({
			alarmArray: timetable.alarmArray,
			color: login.inThemeColor
		})
	);
	const [date, setDate] = useState(dayjs().toDate());

	useEffect(() => {
		setDate(dayjs().toDate());
		return () => {
			dayjs().toDate();
		};
	}, []);

	const onPressClose = useCallback(() => {
		setVisible(false);
		setDateVisible(false);
		setSetting('initial');
		setSubMode('initial');
	}, []);

	// const add = MakeAlarm()
	const [visible, setVisible] = useState(false);
	const [today] = useState(dayjs().format('YYYY-MM-DD'));

	useEffect(() => {}, [alarmArray]);
	const onPressConfirm = useCallback(
		(date) => {
			setDate(date);
			alarmArray.forEach((alarm) => {
				const calStartTime = dayjs()
					.set('day', alarm.dayOfWeek)
					.set('h', alarm.starting_hours)
					.set('m', alarm.starting_minutes)
					.toDate();

				const calEndTime = dayjs()
					.set('day', alarm.dayOfWeek)
					.set('h', alarm.end_hours)
					.set('m', alarm.end_minutes)
					.toDate();

				MakeAlarm({
					title: name,
					calEndTime,
					calStartTime,
					endDate: date,
					alarmTime,
					color
				});
			});
			setSettingModalVisible(true);
			setSetting('loading');
			setSubMode('loading');
		},
		[date, name, alarmArray, color, alarmTime]
	);

	useEffect(() => {
		dateVisible && setVisible(true);
	}, [dateVisible]);
	const isDark = useColorScheme() === 'dark' ? true : false;
	return (
		<>
			<DatePicker
				modal
				open={visible}
				date={date}
				mode="date"
				onConfirm={(date) => {
					setVisible(false);
					onPressConfirm(date);
					setDateVisible(false);
				}}
				onDateChange={(date) => setDate(date)}
				onCancel={onPressClose}
				androidVariant={'nativeAndroid'}
				minuteInterval={10}
				minimumDate={date}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.white
							: Colors.black
						: Colors.black
				}
				title={`오늘 날짜 : ${today}`}
				confirmText="확인"
				cancelText="취소"
			/>
		</>
	);
}
