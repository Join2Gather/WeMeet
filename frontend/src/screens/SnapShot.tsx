/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View,
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Timetable } from '../components/Timetable';
import { Colors } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

type SnapStackParamList = {
	SnapShot: {
		name: string;
		color: string;
		timeMode: string;
	};
};

type Props = NativeStackScreenProps<SnapStackParamList, 'SnapShot'>;
import { RootState } from '../store';

export default function SnapShot({ route }: Props) {
	const { snapShotDate, teamConfirmDate } = useSelector(
		({ timetable }: RootState) => ({
			snapShotDate: timetable.snapShotDate,
			teamConfirmDate: timetable.teamConfirmDate,
		})
	);
	// useState
	const [mode, setMode] = useState('confirmMode');

	// navigation
	const { name, color, timeMode } = route.params;
	const navigation = useNavigation();
	const dispatch = useDispatch();
	//modal

	// useCallback
	const goLeft = useCallback(() => {
		navigation.goBack();
	}, []);

	return (
		<SafeAreaView style={{ backgroundColor: Colors.white }}>
			<ScrollView>
				<View style={[styles.view]}>
					<NavigationHeader
						headerColor={color}
						title={name}
						titleStyle={{ paddingLeft: 0 }}
						Left={() => (
							<Icon
								name="angle-left"
								size={24}
								onPress={goLeft}
								color={Colors.white}
								// style={{ marginLeft: '3%' }}
							/>
						)}
						Right={() => (
							<MIcon
								name="check-bold"
								size={27}
								color={Colors.white}
								style={{ paddingTop: 1 }}
							/>
						)}
					/>

					<View style={styles.viewHeight}>
						<View style={styles.rowButtonView}>
							<View />
							<View style={{ flexDirection: 'row' }}>
								<View style={[styles.boxView, { backgroundColor: color }]} />
								<Text style={styles.infoText}>가능 일정</Text>
								<View
									style={[styles.boxView, { backgroundColor: Colors.grey300 }]}
								/>
								<Text style={styles.infoText}>개인 일정</Text>
								<View
									style={[styles.boxView, { backgroundColor: Colors.white }]}
								/>
								<Text style={styles.infoText}>비어있는 일정</Text>
							</View>
						</View>
					</View>
				</View>
				{timeMode === 'confirm' ? (
					<Timetable teamConfirmDate={teamConfirmDate} color={color} />
				) : (
					<Timetable snapShotDate={snapShotDate} color={color} />
				)}
			</ScrollView>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowButtonView: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 20,
		alignSelf: 'center',
	},
	viewHeight: {
		height: 80,
	},
	touchableBoxView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 15,
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		// height: 20,
	},
	modeDescriptionText: {
		flexDirection: 'row',
		alignSelf: 'center',
	},
	iconText: {
		fontFamily: 'NanumSquareR',
		fontSize: 15,
		textAlign: 'center',
		letterSpacing: -1,
		marginTop: 2,
		marginLeft: 1,
		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		// marginTop: 24,
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		textAlign: 'center',
		letterSpacing: -1,

		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	boxButtonView: {
		width: 15,
		height: 15,
		borderWidth: 0.3,
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.3,
		marginTop: 1,
		alignSelf: 'center',
	},
	titleText: {
		fontSize: 17,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 12,
		letterSpacing: -1,
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
		height: 40,
	},
	loadingText: {
		fontFamily: 'NanumSquareR',
		fontSize: 20,
		color: Colors.white,
	},
});
