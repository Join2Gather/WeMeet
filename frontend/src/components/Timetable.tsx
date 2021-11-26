import React, { useCallback, useState, useEffect } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { ModalMinute } from './ModalMinute';
import { useMakeTimetable } from '../hooks';
import {
	changeAllColor,
	changeDayIdx,
	checkIsBlank,
	checkIsExist,
	cloneEveryTime,
	// changeColor,
	getGroupDates,
	getIndividualDates,
	makeInitialTimePicked,
	makePostIndividualDates,
	postIndividualTime,
	setDay,
	setEndHour,
	setStartHour,
} from '../store/timetable';
import type { make_days, make60 } from '../interface';
import { View, Text, TouchableView } from '../theme';
import { RootState } from '../store';
import { kakaoLogin } from '../store/individual';
import { ModalTimePicker } from './ModalTimePicker';
const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const boxHeight = 28;
const lastBox = 25;

interface props {
	mode: string;
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>> | null;
	setMode: React.Dispatch<React.SetStateAction<string>>;
	isGroup: boolean;
	individualDates?: make60[];
	uri?: string;
	postDatesPrepare?: boolean;
	confirmDatesPrepare?: boolean;
}

export function Timetable({
	mode,
	modalVisible,
	setModalVisible,
	setMode,
	isGroup,
	individualDates,
	uri,
	postDatesPrepare,
	confirmDatesPrepare,
}: props) {
	const {
		dates,
		id,
		user,
		token,
		cloneDateSuccess,
		kakaoDates,
		isTimePicked,
		postIndividualDates,
		confirmDates,
		loadingJoin,
		joinTeamError,
		teamDatesWith60,
		isTimeNotExist,
	} = useSelector(
		({ timetable, individual, login, loading, team }: RootState) => ({
			dates: timetable.dates,
			id: login.id,
			user: login.user,
			token: login.token,
			cloneDateSuccess: individual.cloneDateSuccess,
			kakaoDates: login.kakaoDates,
			postIndividualDates: timetable.postIndividualDates,
			confirmDates: timetable.confirmDates,
			isTimePicked: timetable.isTimePicked,
			loadingJoin: loading['team/JOIN_TEAM'],
			joinTeamError: team.joinTeamError,
			teamDatesWith60: timetable.teamDatesWith60,
			isTimeNotExist: timetable.isTimeNotExist,
		})
	);
	const dispatch = useDispatch();

	const [date, setDate] = useState<Date>(new Date());

	// 최초 렌더링 개인 페이지 정보 받아오기
	useEffect(() => {
		if (!loadingJoin && !joinTeamError) {
			if (uri && isGroup) {
				dispatch(getGroupDates({ id: id, user: user, token: token, uri: uri }));
			} else if (uri && !isGroup) {
				dispatch(
					getIndividualDates({ id: id, user: user, token: token, uri: uri })
				);
			}
		}
	}, [uri, id, user, token, isGroup, loadingJoin, joinTeamError]);

	useEffect(() => {
		if (cloneDateSuccess) {
			dispatch(kakaoLogin(kakaoDates));
			dispatch(cloneEveryTime(kakaoDates));
		}
	}, [cloneDateSuccess, kakaoDates]);
	const { timesText } = useMakeTimetable();
	const onSetStartHour = useCallback(
		(idx: number, time: number, day: string) => {
			dispatch(setStartHour(time));
			date.setHours(time);
			setDate(new Date(date));
			setMode('startMinute');
			setStart(time);
			setModalVisible && setModalVisible(true);
			dispatch(changeDayIdx(idx));
			dispatch(setDay(day));
			isGroup ? dispatch(checkIsExist()) : dispatch(checkIsBlank());
		},
		[isTimePicked, isGroup, date]
	);

	// const onMakeInitial = useCallback(() => {
	// 	Alert.alert('이미 지정된 시간 입니다');
	// 	setMode('normal');
	// 	setModalVisible && setModalVisible(false);
	// }, [isTimePicked]);
	useEffect(() => {
		if (isTimePicked || isTimeNotExist) {
			setMode('normal');
			setModalVisible && setModalVisible(false);
			dispatch(makeInitialTimePicked());
		}
	}, [isTimePicked, isTimeNotExist]);
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
							{teamDatesWith60.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableView
											style={[
												styles.boxView,
												{
													// borderTopWidth: Number(time) === 26 ? 10 : 0.2,
												},
											]}
											key={time}
											onPress={() => {
												mode === 'confirmMode' &&
													onSetStartHour(idx, Number(time), day.day);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={{
														backgroundColor: t.color,
														height: boxHeight / 6,
														borderTopWidth:
															Number(time) === lastBox - 1
																? 0.2
																: t.borderBottom
																? 0.2
																: 0,
														borderBottomWidth:
															Number(time) === lastBox - 2 && tIdx === 5
																? 0.2
																: 0,
														borderLeftWidth:
															Number(time) === lastBox - 1 ? 0 : 0.2,
														borderRightWidth:
															Number(time) === lastBox - 1 ? 0 : 0.2,
													}}
												/>
											))}
										</TouchableView>
									))}
								</View>
							))}
						</>
					) : individualDates ? (
						<>
							{individualDates.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableView
											style={[styles.boxView]}
											key={time}
											onPress={() => console.log(time)}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={{
														backgroundColor: t.color,
														height: boxHeight / 6,
														borderTopWidth:
															Number(time) === lastBox - 1
																? 0.2
																: t.borderBottom
																? 0.2
																: 0,
														borderBottomWidth:
															Number(time) === lastBox - 2 && tIdx === 5
																? 0.2
																: 0,
														borderLeftWidth:
															Number(time) === lastBox - 1 ? 0 : 0.2,
														borderRightWidth:
															Number(time) === lastBox - 1 ? 0 : 0.2,
													}}
												/>
											))}
										</TouchableView>
									))}
								</View>
							))}
						</>
					) : (
						<>
							{dates.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableView
											style={[styles.boxView]}
											key={time}
											onPress={() => {
												mode === 'normal' &&
													onSetStartHour(idx, Number(time), day.day);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={{
														backgroundColor: t.color,
														height: boxHeight / 6,
														borderTopWidth:
															Number(time) === lastBox - 1
																? 0.2
																: t.borderBottom
																? 0.2
																: 0,
														borderBottomWidth:
															Number(time) === lastBox - 2 && tIdx === 5
																? 0.2
																: 0,
														borderLeftWidth:
															Number(time) === lastBox - 1 ? 0 : 0.2,
														borderRightWidth:
															Number(time) === lastBox - 1 ? 0 : 0.2,
													}}
												/>
											))}
										</TouchableView>
									))}
								</View>
							))}
						</>
					)}

					{/* <ModalMinute
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
						confirmDatesPrepare={confirmDatesPrepare}
						isTimePicked={isTimePicked}
						isGroup={isGroup}
						confirmDates={confirmDates}
					/> */}
					<ModalTimePicker
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
						confirmDatesPrepare={confirmDatesPrepare}
						isTimePicked={isTimePicked}
						isGroup={isGroup}
						confirmDates={confirmDates}
						date={date}
						setDate={setDate}
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
		top: '-9%',
	},
	timeText: {
		fontSize: 10,
		alignSelf: 'flex-end',
		textAlign: 'right',
		width: '100%',
		marginTop: 44,
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
		height: boxHeight,
		// marginLeft: 10,
		width: 41,
		// flex: 3,
		// borderWidth: 0.2,
		// borderBottomWidth: 10,
		// borderBottomColor: Colors.red800,
		// borderColor: Colors.blue900,
		// borderTopWidth: 0.2,
		// borderBottomWidth: 0.2,
		// borderRightWidth: 1,
	},
});
