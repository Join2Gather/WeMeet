import React, { useCallback, useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ModalMinute } from './ModalMinute';
import { useMakeTimetable } from '../hooks';
import {
	changeAllColor,
	changeDayIdx,
	// changeColor,
	getGroupDates,
	getIndividualDates,
	makePostIndividualDates,
	postIndividualTime,
	pushSelectEnd,
	pushSelectStart,
	setDay,
	setEndHour,
	setStartHour,
} from '../store/timetable';
import type { make_days } from '../interface';
import { View, Text, TouchableView } from '../theme';
import { RootState } from '../store';
import { kakaoLogin } from '../store/individual';

const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

interface props {
	mode: string;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>> | null;
	setMode: React.Dispatch<React.SetStateAction<string>>;
	isGroup: boolean;
	dates: make_days[];
	uri?: string;
	postDatesPrepare?: boolean;
}

export function Timetable({
	mode,
	modalVisible,
	setModalVisible,
	setMode,
	isGroup,
	dates,
	uri,
	postDatesPrepare,
}: props) {
	const {
		teamDates,
		startTime,
		endTime,
		startMinute,
		endMinute,
		id,
		user,
		token,
		loadingGroup,
		loadingIndividual,
		cloneDateSuccess,
		kakaoDates,
		isTimePicked,
		postIndividualDates,
	} = useSelector(({ timetable, individual, login, loading }: RootState) => ({
		// dates: timetable.dates,
		teamDates: timetable.teamDates,
		startTime: timetable.startTime,
		endTime: timetable.endTime,
		startMinute: timetable.startMinute,
		endMinute: timetable.endMinute,
		id: login.id,
		user: login.user,
		token: login.token,
		loadingGroup: loading['timetable/GET_GROUP'],
		loadingIndividual: loading['timetable/GET_INDIVIDUAL'],
		cloneDateSuccess: individual.cloneDateSuccess,
		kakaoDates: login.kakaoDates,
		postIndividualDates: timetable.postIndividualDates,
		isTimePicked: timetable.isTimePicked,
	}));
	const dispatch = useDispatch();
	// 최초 렌더링 개인 페이지 정보 받아오기
	useEffect(() => {
		if (uri && isGroup) {
			dispatch(getGroupDates({ id: id, user: user, token: token, uri: uri }));
		} else if (uri && !isGroup) {
			dispatch(
				getIndividualDates({ id: id, user: user, token: token, uri: uri })
			);
		}
	}, [uri, id, user, token, isGroup]);
	useEffect(() => {
		if (cloneDateSuccess) {
			dispatch(kakaoLogin(kakaoDates));
		}
	}, [cloneDateSuccess, kakaoDates]);
	const { timesText } = useMakeTimetable();
	const onSetStartHour = useCallback(
		(idx: number, time: number, day: string) => {
			dispatch(setStartHour(time));
			setMode('startMinute');
			setStart(time);
			if (setModalVisible) {
				setModalVisible(true);
			}
			dispatch(changeDayIdx(idx));
			// dispatch(changeColor({ idx: idx, time: time }));
			dispatch(setDay(day));
			dispatch(pushSelectStart(time));
		},
		[]
	);
	useEffect(() => {
		isTimePicked && Alert.alert('이미 지정된 시간 입니다');
	}, [isTimePicked]);
	const onSetEndHour = useCallback((idx: number, time: number) => {
		dispatch(setEndHour(time));
		setEnd(time);
		if (setModalVisible) {
			setModalVisible(true);
		}
		dispatch(pushSelectEnd());
		dispatch(changeAllColor());
	}, []);
	const onMakeInitial = useCallback(() => {
		Alert.alert('이미 지정된 시간 입니다');
		setMode('normal');
		setModalVisible && setModalVisible(false);
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
												mode === 'startMode' &&
													onSetStartHour(idx, Number(d.time), day.day);
												mode === 'endMode' && onSetEndHour(idx, Number(d.time));
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
													height:
														d.mode === 'start'
															? `${100 - d.startPercent}%`
															: d.mode === 'end'
															? `${d.endPercent}%`
															: '100%',

													backgroundColor:
														d.mode === 'start'
															? Colors.white
															: d.mode === 'end'
															? d.color
															: d.color,
												}}
											/>
											<View
												style={{
													height:
														d.mode === 'start'
															? `${d.startPercent}%`
															: d.mode === 'end'
															? `${d.endPercent}%`
															: '0%',
													backgroundColor:
														d.mode === 'start'
															? d.color
															: d.mode === 'end'
															? Colors.white
															: Colors.white,
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
												console.log(d, mode);
												mode === 'startMode' ||
												(mode === 'normal' && d.isFullTime && d.isPicked)
													? onMakeInitial()
													: onSetStartHour(idx, Number(d.time), day.day);
												mode === 'endMode' && onSetEndHour(idx, Number(d.time));
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
													height:
														d.mode === 'start'
															? `${100 - d.startPercent}%`
															: d.mode === 'end'
															? `${d.endPercent}%`
															: '100%',

													backgroundColor:
														d.mode === 'start'
															? Colors.white
															: d.mode === 'end'
															? d.color
															: d.color,
												}}
											/>
											<View
												style={{
													height:
														d.mode === 'start'
															? `${d.startPercent}%`
															: d.mode === 'end'
															? `${d.endPercent}%`
															: '0%',
													backgroundColor:
														d.mode === 'start'
															? d.color
															: d.mode === 'end'
															? Colors.white
															: Colors.white,
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
						id={id}
						postIndividualDates={postIndividualDates}
						token={token}
						uri={uri}
						user={user}
						postDatesPrepare={postDatesPrepare}
						isTimePicked={isTimePicked}
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
		// flex: 3,
		borderWidth: 0.2,
		borderTopWidth: 0.2,
		borderBottomWidth: 0.2,
		// borderRightWidth: 1,
	},
});
