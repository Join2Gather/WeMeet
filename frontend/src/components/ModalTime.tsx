import React, { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	TextInput,
	ActivityIndicator,
	Dimensions,
	ScrollView,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hexToRGB } from '../lib/util/hexToRGB';
import type { findTime } from '../interface/timetable';
import type { individualTime } from '../interface';
import { findTeam } from '../store/login';
import { Button } from '../lib/util/Button';
import {
	deletePostTime,
	makeTeamTime,
	setTimeModalMode,
	toggleIsInitial,
} from '../store/timetable';
import { RootState } from '../store';
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
	const { startHour, endHour, peopleCount } = useSelector(
		({ login }: RootState) => ({
			startHour: login.startHour,
			endHour: login.endHour,
			peopleCount: login.peopleCount,
		})
	);
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');

	useEffect(() => {
		if (mode == 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 1000);
		}
	}, [mode]);

	const onPressDelete = useCallback(() => {
		dispatch(deletePostTime());
		setMode('initial');
		setTimeModalVisible && setTimeModalVisible(false);
		dispatch(toggleIsInitial(true));
		dispatch(setTimeModalMode(false));
		setTimeout(() => {
			color &&
				dispatch(makeTeamTime({ color, endHour, startHour, peopleCount }));
		}, 100);
	}, []);

	const onPressCloseBtn = useCallback(() => {
		setTimeModalVisible && setTimeModalVisible(false);
		setMode('initial');
		dispatch(setTimeModalMode(false));
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
					<View
						style={
							(styles.textView,
							[
								{
									marginBottom: 10,
								},
							])
						}
					>
						<TouchableHighlight
							activeOpacity={1}
							underlayColor={Colors.white}
							style={{
								marginLeft: '90%',
								width: '9%',
							}}
							onPress={onPressCloseBtn}
						>
							<Icon style={{ alignSelf: 'flex-end' }} name="close" size={25} />
						</TouchableHighlight>
					</View>
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
														style={[styles.touchText, { color: Colors.white }]}
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
								{findTime.map((t) => (
									<View key={t.startTime.hour}>
										<View style={[styles.backgroundView]}>
											<View style={styles.columnView}>
												<View style={styles.rowView}>
													<Text style={styles.touchText}>{t.timeText}</Text>
												</View>
											</View>
										</View>
										<View style={styles.blankView} />
									</View>
								))}
								{isGroup && (
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
								)}
							</>
						)}
						<View style={styles.blankView} />
					</ScrollView>
					{!isGroup && !isConfirmMode && (
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
								secondOnPressFunction={() => onPressNext && onPressNext()}
							/>
						</>
					)}
					{mode === 'loading' && (
						<>
							<View style={{ height: 30 }} />
							<ActivityIndicator size="large" color={Colors.blue500} />
							<View style={{ height: 30 }} />
						</>
					)}
					{mode === 'success' && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowView}>
								<Font5Icon
									name="check-circle"
									size={19}
									color={Colors.green500}
								/>
								<Text style={styles.touchText}>
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
		// alignItems: 'center',
		// alignSelf: 'center',
		justifyContent: 'flex-start',
		// backgroundColor: Colors.blue100,
	},
	columnView: {
		flexDirection: 'column',

		borderRadius: 13,

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
		padding: 5,
		borderRadius: 10,
		// alignItems: 'center',
		// alignContent: 'center',
		// alignSelf: 'center',
		justifyContent: 'center',
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
