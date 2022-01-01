import React, { useCallback, useState, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';

import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import DatePicker from 'react-native-date-picker';
import { useIsDarkMode } from '../hooks';
import MakeAlarm from '../lib/util/MakeAlarm';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
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
	setSettingModalVisible,
}: props) {
	const { alarmArray, color } = useSelector(
		({ timetable, login }: RootState) => ({
			alarmArray: timetable.alarmArray,
			color: login.individualColor,
		})
	);
	const dispatch = useDispatch();
	// const [minute, setMinute] = useState(0);
	// const [hour, setHour] = useState(0);
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
					color,
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
	const { isDark } = useIsDarkMode();
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
				androidVariant={'iosClone'}
				minuteInterval={10}
				minimumDate={date}
				textColor={
					Platform.OS === 'ios'
						? isDark
							? Colors.black
							: Colors.white
						: Colors.black
				}
				title={`오늘 날짜 : ${today}`}
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
