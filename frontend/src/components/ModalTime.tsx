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
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hexToRGB } from '../lib/util/hexToRGB';
import type { findTime } from '../interface/timetable';
import type { individualTime } from '../interface';
import { findTeam } from '../store/login';
import { Button } from '../lib/util/Button';
import { deletePostTime, setTimeModalMode } from '../store/timetable';
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
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});
	useEffect(() => {
		if (mode == 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 1000);
		}
	}, [mode]);
	useEffect(() => {
		if (color) {
			const result = hexToRGB(color);
			result && setRGBColor(result);
		}
	}, [color]);
	const onPressDelete = useCallback(() => {
		dispatch(deletePostTime());
		setMode('loading');
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
					{mode === 'initial' && (
						<>
							{findTime && findTime[0] && (
								<>
									<View style={styles.blankView} />
									<Text style={styles.titleText}>선택 시간</Text>
									<View style={styles.blankView} />

									<View style={[styles.backgroundView]}>
										<View style={styles.columnView}>
											<View style={styles.rowView}>
												<Text style={styles.touchText}>
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
												<Text style={styles.touchText}>
													{t.startTime.hour > 12
														? `오후  ${t.startTime.hour - 12}`
														: `오전  ${t.startTime.hour}`}
													{'  : '}
													{t.startTime.minute < 10
														? '0' + t.startTime.minute
														: t.startTime.minute}
													{' ~   '}
												</Text>

												<Text style={styles.touchText}>
													{t.endTime.hour >= 12
														? `오후  ${t.endTime.hour - 12}`
														: `오전  ${t.endTime.hour}`}
													{' : '}
													{t.endTime.minute < 10
														? '0' + t.endTime.minute
														: t.endTime.minute}
												</Text>
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
														<Text style={styles.touchText}>{t.people}</Text>
													</View>
												</View>
											</View>
											<View style={styles.blankView} />
										</View>
									))}
								</>
							)}
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
		width: screen.width * 0.53,
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'flex-start',
	},
	columnView: {
		flexDirection: 'column',

		borderRadius: 13,

		margin: 30,
		marginBottom: 20,
		marginTop: 20,
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
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		width: screen.width * 0.9,
	},
	touchText: {
		fontSize: 15,
		textAlign: 'center',
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
		marginLeft: '8%',
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
		borderWidth: 0.4,
		width: '110%',
		marginTop: 15,
	},
});
