import React, { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	ActivityIndicator,
	Dimensions,
	ScrollView,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { findTime } from '../interface/timetable';
import { Button } from '../lib/util/Button';
import {
	deletePostTime,
	makeTeamTime,
	setSelectIdx,
	setTimeModalMode,
	toggleIsInitial,
} from '../store/timetable';
import { RootState } from '../store';
import { CloseButton } from '../theme';
import {
	cloneINDates,
	initialIndividualTimetable,
	makeHomeTime,
} from '../store/individual';
import { getUserMe, toggleUserMeSuccess } from '../store/login';
const screen = Dimensions.get('screen');

interface props {
	timeModalVisible?: boolean;
	setTimeModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	color?: string;
	findTime: findTime[];
	isConfirmMode: boolean;
	onPressNext?: () => void;
	tableMode: string;
	isGroup?: boolean;
}

export function ModalTime({
	timeModalVisible,
	setTimeModalVisible,
	color,
	findTime,
	isConfirmMode,
	onPressNext,
	tableMode,
	isGroup,
}: props) {
	const {
		startHour,
		endHour,
		peopleCount,
		selectIdx,
		token,
		userMeSuccess,
		confirmClubs,
		confirmDatesTimetable,
		isConfirmProve,
		inTimeColor,
	} = useSelector(({ login, timetable }: RootState) => ({
		startHour: login.startHour,
		endHour: login.endHour,
		peopleCount: login.peopleCount,
		selectIdx: timetable.selectIdx,
		token: login.token,
		userMeSuccess: login.userMeSuccess,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		isConfirmProve: login.isConfirmProve,
		inTimeColor: login.inTimeColor,
	}));
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');

	const [check, setCheck] = useState(0);

	useEffect(() => {
		if (mode == 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 1000);
		}
	}, [mode]);

	const onPressDelete = useCallback(() => {
		dispatch(deletePostTime());
		setMode('loading');
		dispatch(setTimeModalMode(false));
		isConfirmProve && dispatch(initialIndividualTimetable());

		setTimeout(() => {
			color &&
				dispatch(makeTeamTime({ color, endHour, startHour, peopleCount }));
			isConfirmProve && dispatch(getUserMe({ token }));
		}, 100);
	}, []);

	useEffect(() => {
		if (userMeSuccess) {
			dispatch(makeHomeTime());
			dispatch(cloneINDates({ confirmClubs, confirmDatesTimetable, inTimeColor }));
		}
		setTimeout(() => {
			dispatch(toggleUserMeSuccess());
		}, 300);
	}, [userMeSuccess]);

	const onPressCloseBtn = useCallback(() => {
		setTimeModalVisible && setTimeModalVisible(false);
		setMode('initial');
		dispatch(setTimeModalMode(false));
	}, []);

	const onPressTimeText = useCallback((idx: number) => {
		dispatch(setSelectIdx(idx));
	}, []);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={timeModalVisible}
			onRequestClose={() => {
				Alert.alert('Modal has been closed.');
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<CloseButton closeBtn={onPressCloseBtn} />
					<ScrollView>
						{mode === 'initial' && (
							<>
								{findTime && findTime[0] && (
									<>
										<View style={styles.blankView} />
										<Text style={styles.titleText}>선택 시간</Text>
										<View style={styles.blankView} />

										<View
											style={[
												styles.backgroundView,
												{ backgroundColor: color },
											]}
										>
											<View style={styles.columnView}>
												<View style={styles.rowView}>
													<Text
														style={[
															styles.touchText,
															{ color: Colors.grey100 },
														]}
													>
														{findTime[0].selectTime > 12
															? `오후  ${findTime[0].selectTime - 12}시`
															: `오전  ${findTime[0].selectTime}시`}
													</Text>
												</View>
											</View>
										</View>
									</>
								)}

								<View style={styles.blankView} />
								<Text style={styles.titleText}>가능 시간</Text>
								<View style={styles.blankView} />
								{findTime.map((t, idx) => (
									<View key={t.startTime.hour}>
										<View style={[styles.backgroundView]}>
											<View style={[styles.columnView, { margin: 0 }]}>
												<TouchableHighlight
													activeOpacity={1}
													underlayColor={Colors.grey300}
													onPress={() => onPressTimeText(idx)}
													style={[
														styles.touchButtonStyle,
														{
															backgroundColor: isConfirmMode
																? idx == selectIdx
																	? Colors.grey600
																	: Colors.grey100
																: Colors.grey100,
														},
													]}
												>
													<View style={styles.rowView}>
														<Text
															style={[
																styles.touchText,
																{
																	color: isConfirmMode
																		? idx === selectIdx
																			? Colors.white
																			: Colors.grey800
																		: Colors.black,
																},
															]}
														>
															{t.timeText}
														</Text>
														{isConfirmMode && (
															<MIcon
																name={
																	idx === selectIdx
																		? 'checkbox-marked'
																		: 'checkbox-blank-outline'
																}
																size={20}
																style={{ position: 'absolute', right: 0 }}
																color={
																	idx === selectIdx
																		? Colors.white
																		: Colors.black
																}
															/>
														)}
													</View>
												</TouchableHighlight>
											</View>
										</View>
										<View style={styles.blankView} />
									</View>
								))}
								{isGroup ? (
									<>
										<View style={styles.blankView} />
										<Text style={styles.titleText}>참여 인원</Text>
										<View style={styles.blankView} />
										{findTime.map((t) => (
											<View key={t.startTime.hour}>
												<View style={[styles.backgroundView]}>
													<View style={styles.columnView}>
														<View style={styles.rowView}>
															<Text style={styles.touchText} numberOfLines={5}>
																{t.people}
															</Text>
															<Text style={styles.touchText}> </Text>
														</View>
													</View>
												</View>
												<View style={styles.blankView} />
											</View>
										))}
									</>
								) : (
									isConfirmMode && (
										<>
											<View style={styles.blankView} />
											<Text style={styles.titleText}>참여 인원</Text>
											<View style={styles.blankView} />
											{findTime.map((t, idx) => (
												<View key={t.startTime.hour}>
													<View style={[styles.backgroundView]}>
														<View style={[styles.columnView, { margin: 0 }]}>
															<TouchableHighlight
																activeOpacity={1}
																underlayColor={Colors.grey300}
																onPress={() => onPressTimeText(idx)}
																style={[
																	styles.touchButtonStyle,
																	{
																		backgroundColor:
																			idx == selectIdx
																				? Colors.grey600
																				: Colors.grey100,
																	},
																]}
															>
																<View style={styles.rowView}>
																	<Text
																		style={[
																			styles.touchText,
																			{
																				color:
																					idx === selectIdx
																						? Colors.white
																						: Colors.grey800,
																			},
																		]}
																		numberOfLines={5}
																	>
																		{t.people}
																	</Text>
																</View>
															</TouchableHighlight>
														</View>
													</View>
													<View style={styles.blankView} />
												</View>
											))}
										</>
									)
								)}
							</>
						)}
						<View style={styles.blankView} />
					</ScrollView>
					{!isGroup && !isConfirmMode && mode === 'initial' && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowLine} />
							<Button
								buttonNumber={2}
								buttonText="취소"
								secondButtonText="삭제"
								onPressFunction={() =>
									setTimeModalVisible && setTimeModalVisible(false)
								}
								secondOnPressFunction={onPressDelete}
							/>
						</>
					)}
					{isConfirmMode && (
						<>
							<View style={styles.rowLine} />
							<Button
								buttonNumber={2}
								buttonText="취소"
								secondButtonText="다음"
								onPressFunction={() =>
									setTimeModalVisible && setTimeModalVisible(false)
								}
								secondOnPressFunction={onPressNext}
							/>
						</>
					)}
					{mode === 'loading' && (
						<>
							<View style={{ height: 30 }} />
							<ActivityIndicator size="large" color={color} />
							<View style={{ height: 30 }} />
						</>
					)}
					{mode === 'success' && (
						<>
							<View style={styles.blankView} />
							<View style={[styles.rowView, { justifyContent: 'center' }]}>
								<Font5Icon
									name="check-circle"
									size={19}
									color={Colors.green500}
								/>
								<Text style={[styles.touchText, { marginLeft: 10 }]}>
									{' '}
									변경 사항이 저장 되었습니다
								</Text>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={onPressCloseBtn}
							/>
						</>
					)}
				</View>
			</View>
		</Modal>
		// </AutoFocusProvider>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: -20,
	},
	rowView: {
		flexDirection: 'row',
		width: screen.width * 0.52,

		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	columnView: {
		flexDirection: 'column',

		// borderRadius: 13,

		margin: 20,
	},
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100,
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1,
	},
	modalView: {
		// margin: 10,
		marginBottom: 60,
		backgroundColor: Colors.white,
		borderRadius: 13,
		padding: 20,
		alignItems: 'center',
		shadowColor: 'black',
		elevation: 10,
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		width: screen.width * 0.9,
		maxHeight: screen.height * 0.7,
	},
	touchText: {
		fontSize: 13,
		textAlign: 'left',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		justifyContent: 'center',
	},
	titleText: {
		fontSize: 20,
		textAlign: 'left',
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '1%',
	},
	blankView: {
		height: 10,
	},
	textView: {
		width: '100%',
	},
	touchButtonStyle: {
		padding: 20,
		borderRadius: 13,
		// alignItems: 'center',
		// alignContent: 'center',
		// alignSelf: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
	},
	buttonOverLine: {
		borderWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	rowLine: {
		borderTopWidth: 0.4,
		width: '113%',
		marginTop: 15,
	},
});
