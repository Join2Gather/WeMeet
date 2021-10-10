import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';

import { useMakeTimetable } from '../hooks';
import { time } from '../interface';
import { View, Text, TouchableView } from '../theme';
import { ModalMinute } from './ModalMinute';
const dayOfWeek = ['SUN', 'TUE', 'THU', 'WED', 'THU', 'FRI', 'SAT'];

interface props {
	mode: string;
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Timetable({ mode, modalVisible, setModalVisible }: props) {
	const { defaultDates, timesText } = useMakeTimetable();
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
									onPress={() => mode === ('1' || '3') && console.log('hi')}
									key={Number(d.time)}
									style={[
										styles.boxView,
										{
											borderBottomWidth: Number(d.time) === 24 ? 0.3 : 0,
											borderTopWidth:
												Number(d.time) === 24
													? 0
													: Number(d.time) % 1 === 0
													? 0.3
													: 0,
											backgroundColor: d.color,
										},
									]}
								></TouchableView>
							))}
						</View>
					))}
					{/* <ModalMinute /> */}
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
		top: '-11%',
	},
	timeText: {
		fontSize: 10,
		textAlign: 'right',
		width: 30,
		marginTop: 50.8,
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
		height: 7.75,
		// marginLeft: 10,
		width: 40,
		borderWidth: 0.3,
		borderTopWidth: 0,
		borderBottomWidth: 0,
		// borderRightWidth: 1,
	},
});
