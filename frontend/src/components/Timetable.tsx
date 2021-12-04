import React, { useCallback, useState, useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeDayIdx,
	checkIsBlank,
	checkIsExist,
	cloneEveryTime,
	getGroupDates,
	getIndividualDates,
	getOtherConfirmDates,
	makeInitialTimePicked,
	setDay,
	setEndHour,
	setStartHour,
} from '../store/timetable';
import type { make_days, make60 } from '../interface';
import { View, Text, TouchableView } from '../theme';
import { RootState } from '../store';
import { kakaoLogin } from '../store/individual';
import { ModalTimePicker } from '.';
// import { ModalTimePicker } from './ModalTimePicker';
const dayOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const boxHeight = 28;
const inBoxHeight = 7;
const lastBox = 25;
const screen = Dimensions.get('screen');
const borderWidth = 0.3;
interface props {
	mode?: string;
	modalVisible?: boolean;
	setModalVisible?: React.Dispatch<React.SetStateAction<boolean>> | null;
	setMode?: React.Dispatch<React.SetStateAction<string>>;
	isGroup?: boolean;
	individualDates?: make60[];
	snapShotDate?: make60[];
	uri?: string;
	postDatesPrepare?: boolean;
	confirmDatesPrepare?: boolean;
	individualTimesText?: Array<string>;
	endIdx?: number;
	color?: string;
	teamConfirmDate?: make60[];
}

export function Timetable({
	mode,
	modalVisible,
	setModalVisible,
	setMode,
	isGroup,
	individualDates,
	snapShotDate,
	uri,
	postDatesPrepare,
	confirmDatesPrepare,
	individualTimesText,
	endIdx,
	color,
	teamConfirmDate,
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
		timeMode,
		joinUri,
		confirmClubs,
		confirmDatesTimetable,
		timesText,
		endHourTimetable,
		reload,
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
			timeMode: timetable.timeMode,
			joinUri: team.joinUri,
			confirmClubs: login.confirmClubs,
			confirmDatesTimetable: login.confirmDatesTimetable,
			timesText: timetable.timesText,
			endHourTimetable: timetable.endHour,
			reload: timetable.reload,
		})
	);
	const dispatch = useDispatch();

	const [date, setDate] = useState<Date>(new Date());
	const [endHour, setEndHour] = useState(0);

	useEffect(() => {
		endIdx ? setEndHour(endIdx) : setEndHour(endHourTimetable);
	}, [endIdx, endHourTimetable]);
	// 최초 렌더링 개인 페이지 정보 받아오기
	useEffect(() => {
		if (!loadingJoin && !joinTeamError) {
			if (uri && isGroup) {
				if (timeMode === 'make')
					dispatch(getGroupDates({ id, user, token, uri: joinUri }));
				else dispatch(getGroupDates({ id, user, token, uri }));
				isGroup &&
					dispatch(
						getOtherConfirmDates({
							confirmClubs,
							confirmDatesTimetable,
							isGroup,
						})
					);
			} else if (uri && !isGroup) {
				if (timeMode == 'make')
					dispatch(getIndividualDates({ id, user, token, uri: joinUri }));
				else {
					dispatch(getIndividualDates({ id, user, token, uri }));
				}
				isGroup &&
					dispatch(
						getOtherConfirmDates({
							confirmClubs,
							confirmDatesTimetable,
							isGroup,
						})
					);
			}
		}
	}, [
		uri,
		id,
		user,
		token,
		isGroup,
		loadingJoin,
		joinTeamError,
		joinUri,
		timeMode,
		reload,
	]);

	useEffect(() => {
		if (cloneDateSuccess) {
			dispatch(kakaoLogin(kakaoDates));
			dispatch(cloneEveryTime(kakaoDates));
		}
	}, [cloneDateSuccess, kakaoDates]);

	const onSetStartHour = useCallback(
		(idx: number, time: number, day: string) => {
			dispatch(setStartHour(time));
			date.setHours(time);
			setDate(new Date(date));
			setMode && setMode('startMinute');
			setModalVisible && setModalVisible(true);
			dispatch(changeDayIdx(idx));
			dispatch(setDay(day));
			isGroup ? dispatch(checkIsExist()) : dispatch(checkIsBlank());
		},
		[isTimePicked, isGroup, date]
	);
	useEffect(() => {
		if (isTimePicked || isTimeNotExist) {
			setMode && setMode('normal');
			setModalVisible && setModalVisible(false);
			dispatch(makeInitialTimePicked());
		}
	}, [isTimePicked, isTimeNotExist]);
	return (
		<View style={styles.view}>
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
				<View style={[styles.timeView, {}]}>
					{individualTimesText
						? individualTimesText.map((time, idx) => (
								<View
									style={[
										styles.timeEachView,
										{ borderColor: color ? color : Colors.blue500 },
									]}
									key={idx}
								>
									<Text style={styles.timeText}>{time}</Text>
								</View>
						  ))
						: timesText.map((time, idx) => (
								<View
									style={[
										styles.timeEachView,
										{ borderColor: color ? color : Colors.blue500 },
									]}
									key={idx}
								>
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
											style={[styles.boxView]}
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
														height: boxHeight / inBoxHeight,
														borderTopWidth:
															Number(time) === endHour
																? borderWidth
																: t.borderBottom
																? borderWidth
																: 0,
														borderBottomWidth:
															Number(time) === endHour - 1 && tIdx === 6
																? borderWidth
																: 0,
														borderLeftWidth:
															Number(time) === endHour ? 0 : borderWidth,
														borderRightWidth:
															Number(time) === endHour ? 0 : borderWidth,
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
														height: boxHeight / inBoxHeight,
														borderTopWidth:
															Number(time) === endHour
																? borderWidth
																: t.borderBottom
																? borderWidth
																: 0,
														borderBottomWidth:
															Number(time) === endHour - 1 && tIdx === 6
																? borderWidth
																: 0,
														borderLeftWidth:
															Number(time) === endHour ? 0 : borderWidth,
														borderRightWidth:
															Number(time) === endHour ? 0 : borderWidth,
													}}
												/>
											))}
										</TouchableView>
									))}
								</View>
							))}
						</>
					) : snapShotDate ? (
						<>
							{snapShotDate.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableView
											style={[styles.boxView]}
											key={time}
											onPress={() => {
												console.log('hi');
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={{
														backgroundColor: t.color,
														height: boxHeight / inBoxHeight,
														borderTopWidth:
															Number(time) === endHour
																? borderWidth
																: t.borderBottom
																? borderWidth
																: 0,
														borderBottomWidth:
															Number(time) === endHour - 1 && tIdx === 6
																? borderWidth
																: 0,
														borderLeftWidth:
															Number(time) === endHour ? 0 : borderWidth,
														borderRightWidth:
															Number(time) === endHour ? 0 : borderWidth,
													}}
												/>
											))}
										</TouchableView>
									))}
								</View>
							))}
						</>
					) : teamConfirmDate ? (
						<>
							{teamConfirmDate.map((day, idx) => (
								<View style={styles.columnView} key={day.day}>
									{Object.keys(day.times).map((time) => (
										<TouchableView
											style={[styles.boxView]}
											key={time}
											onPress={() => {
												mode === 'normal' &&
													onSetStartHour(idx, Number(time), day.day);
												mode === 'startMode' &&
													onSetStartHour(idx, Number(time), day.day);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={{
														backgroundColor: t.color,
														height: boxHeight / inBoxHeight,
														borderTopWidth:
															Number(time) === endHour
																? borderWidth
																: t.borderBottom
																? borderWidth
																: 0,
														borderBottomWidth:
															Number(time) === endHour - 1 && tIdx === 6
																? borderWidth
																: 0,
														borderLeftWidth:
															Number(time) === endHour ? 0 : borderWidth,
														borderRightWidth:
															Number(time) === endHour ? 0 : borderWidth,
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
												mode === 'startMode' &&
													onSetStartHour(idx, Number(time), day.day);
											}}
										>
											{day.times[time].map((t, tIdx) => (
												<View
													key={t.minute}
													style={{
														backgroundColor: t.color,
														height: boxHeight / inBoxHeight,
														borderTopWidth:
															Number(time) === endHour
																? borderWidth
																: t.borderBottom
																? borderWidth
																: 0,
														borderBottomWidth:
															Number(time) === endHour - 1 && tIdx === 6
																? borderWidth
																: 0,
														borderLeftWidth:
															Number(time) === endHour ? 0 : borderWidth,
														borderRightWidth:
															Number(time) === endHour ? 0 : borderWidth,
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
						timeMode={timeMode}
						joinUri={joinUri}
					/>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	view: { flex: 1, flexDirection: 'column', paddingTop: 25 },
	contentView: {
		flexDirection: 'row',
		width: '90%',
		justifyContent: 'space-evenly',
	},
	dayOfWeekView: {
		width: screen.width / 9,
	},
	dayOfText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
	},
	timeView: {
		width: screen.width / 13,
	},
	timeText: {
		fontSize: 10,
		alignSelf: 'flex-end',
		textAlign: 'right',
		fontFamily: 'NanumSquareR',
		marginTop: 2,
	},
	columnView: {
		flexDirection: 'column',
	},
	rowView: {
		flexDirection: 'row',
	},
	rowDayOfWeekView: {
		flexDirection: 'row',
		paddingBottom: 10,
	},
	boxView: {
		height: boxHeight,
		width: screen.width / 9,
	},
	timeEachView: {
		height: boxHeight * 2,
		borderTopWidth: 2,
		borderColor: Colors.blue500,
		width: '100%',
		alignSelf: 'flex-end',
	},
});
