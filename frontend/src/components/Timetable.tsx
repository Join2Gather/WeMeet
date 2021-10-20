import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ModalMinute } from './ModalMinute';
import { useMakeTimetable } from '../hooks';
import {
	changeAllColor,
	changeColor,
	pushSelectEnd,
	setDay,
	setEndHour,
	setStartHour,
} from '../store/timetable';
import { View, Text, TouchableView } from '../theme';
import { RootState } from '../store';

const dayOfWeek = ['SUN', 'TUE', 'THU', 'WED', 'THU', 'FRI', 'SAT'];

interface props {
	mode: string;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setMode: React.Dispatch<React.SetStateAction<string>>;
	isGroup: boolean;
}

export function Timetable({
	mode,
	modalVisible,
	setModalVisible,
	setMode,
	isGroup,
}: props) {
	const { timesText } = useMakeTimetable();
	const { dates, teamDates } = useSelector(({ timetable }: RootState) => ({
		dates: timetable.dates,
		teamDates: timetable.teamDates,
	}));
	const dispatch = useDispatch();
	const onSetStartHour = useCallback(
		(idx: number, time: number, day: string) => {
			dispatch(setStartHour(time));
			setMode('2');
			setStart(time);
			setModalVisible(true);
			dispatch(changeColor({ idx: idx, time: time }));
			dispatch(setDay(day));
		},
		[]
	);
	const onSetEndHour = useCallback((idx: number, time: number) => {
		dispatch(setEndHour(time));
		setMode('4');
		setModalVisible(true);
		dispatch(pushSelectEnd());
		dispatch(changeAllColor());
	}, []);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(0);
	return (
		<View style={styles.view}>
			<View style={styles.rowView}>
				<View style={styles.timeView}>
					<View style={{ width: 30 }}></View>
				</View>
				<View style={styles.contentView}>
					{dayOfWeek.map((dayText, idx) => (
						<View style={styles.dayOfWeekView} key={idx}>
							<Text
								style={[
									styles.dayOfText,
									{ color: idx === 0 ? Colors.red500 : Colors.black },
								]}
							>
								{dayText}
							</Text>
						</View>
					))}
				</View>
			</View>
			<View style={styles.rowView}>
				<View style={styles.timeView}>
					{timesText.map((time, idx) => (
						<View key={idx}>
							<Text style={styles.timeText}>{time}</Text>
						</View>
					))}
				</View>
				<View style={styles.contentView}>
					{isGroup ? (
						<>
							{teamDates.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{day.times.map((d) => (
										<TouchableView
											onPress={() => {
												mode === '1' &&
													onSetStartHour(idx, Number(d.time), day.day);
												mode === '3' && onSetEndHour(idx, Number(d.time));
											}}
											key={Number(d.time)}
											style={[
												styles.boxView,
												{
													borderBottomWidth: Number(d.time) === 1 ? 0.3 : 0,
													// backgroundColor: d.color,
												},
											]}
										>
											<View
												style={{
													height: '50%',
													backgroundColor: d.time % 1 ? Colors.white : d.color,
												}}
											/>
											<View
												style={{
													height: '50%',
													backgroundColor: d.time % 1 ? Colors.white : d.color,
												}}
											/>
										</TouchableView>
									))}
								</View>
							))}
						</>
					) : (
						<>
							{dates.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{day.times.map((d) => (
										<TouchableView
											onPress={() => {
												mode === '1' &&
													onSetStartHour(idx, Number(d.time), day.day);
												mode === '3' && onSetEndHour(idx, Number(d.time));
											}}
											key={Number(d.time)}
											style={[
												styles.boxView,
												{
													borderBottomWidth: Number(d.time) === 1 ? 0.3 : 0,
													// backgroundColor: d.color,
												},
											]}
										>
											<View
												style={{
													height: '50%',
													backgroundColor: d.time % 1 ? Colors.white : d.color,
												}}
											/>
											<View
												style={{
													height: '50%',
													backgroundColor: d.time % 1 ? Colors.white : d.color,
												}}
											/>
										</TouchableView>
									))}
								</View>
							))}
						</>
					)}
					<ModalMinute
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						start={start}
						end={end}
						mode={mode}
						setMode={setMode}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	view: { flex: 1, flexDirection: 'column' },
	contentView: {
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-evenly',
	},
	dayOfWeekView: {
		// marginTop: '20%',
	},
	dayOfText: {
		width: 40,
		textAlign: 'center',
		paddingTop: 20,
		fontFamily: 'NanumSquareR',
		// height: 80,
	},
	timeView: {
		top: '-10%',
	},
	timeText: {
		fontSize: 10,
		alignSelf: 'flex-end',
		textAlign: 'right',
		width: '100%',
		marginTop: 47.5,
		fontFamily: 'NanumSquareR',
	},
	columnView: {
		flexDirection: 'column',
		top: '3%',
	},
	rowView: {
		flexDirection: 'row',
		// width: '100%',
		// textAlign: 'center',
		// justifyContent: 'center',
		// textAlignVertical: 'center',
	},
	boxView: {
		height: 29.6,
		// marginLeft: 10,
		width: 41,
		borderWidth: 0.3,
		borderTopWidth: 0.3,
		borderBottomWidth: 0.2,
		// borderRightWidth: 1,
	},
});
