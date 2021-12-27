import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { View, Text } from '../theme';

const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const screen = Dimensions.get('screen');

export function DayOfWeek() {
	const {} = useSelector(({ timetable }: RootState) => ({}));
	return (
		<View style={styles.rowDayOfWeekView}>
			<View style={styles.timeView}>
				<View style={styles.dayOfWeekView}></View>
			</View>
			<View style={styles.contentView}>
				{dayOfWeek.map((dayText, idx) => (
					<View style={styles.dayOfWeekView} key={idx}>
						<Text
							style={[
								styles.dayOfText,
								{
									color:
										idx === 0
											? Colors.red500
											: idx === 6
											? Colors.blue700
											: Colors.black,
								},
							]}
						>
							{dayText}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	rowDayOfWeekView: {
		flexDirection: 'row',
		paddingBottom: 10,
	},
	timeView: {
		width: screen.width / 13,
	},
	dayOfWeekView: {
		width: screen.width / 9,
	},
	contentView: {
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-evenly',
	},
	dayOfText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
	},
});
