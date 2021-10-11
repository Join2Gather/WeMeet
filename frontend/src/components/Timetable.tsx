import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ModalMinute } from './ModalMinute';
import { useMakeTimetable } from '../hooks';
import { setEndHour, setStartHour } from '../store/timetable';
import { View, Text, TouchableView } from '../theme';

const dayOfWeek = ['SUN', 'TUE', 'THU', 'WED', 'THU', 'FRI', 'SAT'];

interface props {
	mode: string;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setMode: React.Dispatch<React.SetStateAction<string>>;
}

export function Timetable({
	mode,
	modalVisible,
	setModalVisible,
	setMode,
}: props) {
	const { defaultDates, timesText } = useMakeTimetable();
	const dispatch = useDispatch();
	const onSetStartHour = useCallback((time: number) => {
		dispatch(setStartHour(time));
		setMode('2');
		setModalVisible(true);
	}, []);
	const onSetEndHour = useCallback((time: number) => {
		dispatch(setEndHour(time));
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
					{defaultDates.map((day) => (
						<View style={styles.columnView} key={day.day}>
							{day.times.map((d, idx) => (
								<TouchableView
									onPress={() => {
										mode === '1' && onSetStartHour(Number(d.time)),
											setStart(d.time);
										mode === '3' && onSetEndHour(Number(d.time)),
											setEnd(d.time);
									}}
									key={Number(d.time)}
									style={[
										styles.boxView,
										{
											borderBottomWidth: Number(d.time) === 1 ? 0.3 : 0,
											// borderTopWidth:
											// 	Number(d.time) === 24
											// 		? 0
											// 		: Number(d.time) % 1 === 0
											// 		? 0.3
											// 		: 0,
											backgroundColor: d.color,
										},
									]}
								>
									<View style={{}} />
									<View style={{}} />
								</TouchableView>
							))}
						</View>
					))}
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
		width: 40,
		borderWidth: 0.3,
		borderTopWidth: 0.3,
		borderBottomWidth: 0.3,
		// borderRightWidth: 1,
	},
});
