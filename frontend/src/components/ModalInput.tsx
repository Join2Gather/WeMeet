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
	KeyboardAvoidingView,
	Platform,
} from 'react-native';

import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import {
	initialError,
	inputTeamName,
	joinTeam,
	postTeamName,
	setModalMode,
} from '../store/team';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { ColorPicker, fromHsv } from 'react-native-color-picker';
// import { CromaColorPicker as ColorPicker } from 'croma-color-picker';

import Material from 'react-native-vector-icons/MaterialIcons';
import { getUserMe } from '../store/login';
import { setTimeMode } from '../store/timetable';
import { Button } from '../theme/Button';
import { Sequence } from './Sequence';
import { current } from '@reduxjs/toolkit';
import ColorPicker from 'react-native-wheel-color-picker';
import { CloseButton } from '../theme';
const screen = Dimensions.get('screen');
interface props {
	modalVisible: boolean;
	setModalVisible: any;
	user: number;
	id: number;
	token: string;
	goTeamTime: Function;
	modalMode: string;
	loadingJoin: string[];
	loadingChangeColor: string[];
	joinTeamError: boolean;
	postTeamError: boolean;
	joinUri: string;
	joinName: string;
	makeReady: boolean;
	individualColor: string;
	sequence: number[];
}

export function ModalInput({
	modalVisible,
	setModalVisible,
	user,
	id,
	token,
	goTeamTime,
	modalMode,
	loadingJoin,
	loadingChangeColor,
	joinTeamError,
	joinUri,
	postTeamError,
	joinName,
	makeReady,
	individualColor,
	sequence,
}: props) {
	const dispatch = useDispatch();
	// const [name, setName] = useState('2ff148e7-05b9-461e-a2c2-1d3ccce16ba9');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [mode, setMode] = useState('initial');
	const [color, setColor] = useState(Colors.red500);
	const [hsvColor, setHSV] = useState({
		hue: 0,
		sat: 0,
		val: 0,
	});
	const [startTime, setStartTime] = useState('9');

	const [endTime, setEndTime] = useState('22');
	const [currentNumber, setCurrent] = useState(0);

	const onSatValPickerChange = useCallback(({ sat, val }) => {
		setHSV((prevState) => ({
			...prevState,
			sat: sat,
			val: val,
		}));
	}, []);

	const onHuePickerChange = useCallback((hue) => {
		setHSV((prevState) => ({
			...prevState,
			hue: hue,
		}));
	}, []);

	// useEffect
	useEffect(() => {
		if (joinTeamError) setMode('joinError');
		else if (mode === 'finish' && modalMode === 'join') setMode('joinSuccess');
		if (postTeamError) setMode('makeError');
		else if (mode === 'finish' && modalMode === 'make') setMode('makeSuccess');
	}, [joinTeamError, postTeamError, mode, modalMode]);
	useEffect(() => {
		mode === 'send' && modeChange();
	}, [mode]);

	// useCallback
	const modeChange = useCallback(() => {
		if (mode === 'send') {
			dispatch(initialError());
			setMode('loading');
			if (modalMode === 'join') {
				dispatch(joinTeam({ id, token, user, uri: code }));
				setCurrent(2);
				setTimeout(() => setMode('finish'), 1000);
			} else if (modalMode === 'make') {
				dispatch(inputTeamName(name));
				dispatch(
					postTeamName({
						color,
						endTime: Number(endTime),
						startTime: Number(startTime),
						id,
						token,
						name,
						user,
					})
				);
				setCurrent(3);
				setTimeout(() => setMode('finish'), 1000);
			}
		} else if (mode === 'close') {
			dispatch(setTimeMode('make'));
			setMode('initial');
			setModalVisible(false);
		}
	}, [name, modalMode, mode, color, id, token, joinUri, user, code]);

	const onPressPrev = useCallback(
		(mode) => {
			setMode(mode);
			setCurrent((current) => current - 1);
		},
		[current]
	);
	const onPressNext = useCallback((mode) => {
		setMode(mode);
		setCurrent((current) => current + 1);
	}, []);
	const onCloseError = useCallback(() => {
		setMode('initial');
		dispatch(setTimeMode('normal'));
		dispatch(setModalMode('normal'));
		setModalMode('normal');
		dispatch(initialError());
		setModalVisible(false);
		setColor(Colors.red500);
		dispatch(getUserMe({ token }));
		setCurrent(0);
	}, []);
	const onPressClose = useCallback(() => {
		dispatch(initialError());
		dispatch(getUserMe({ token }));
		setModalVisible(false);
		setMode('initial');
		setCurrent(0);
		if (modalMode === 'join') {
			const uri = joinUri;
			goTeamTime({ uri });
			setCode('');
		} else if (modalMode === 'make') {
			setColor(Colors.red500);
			setStartTime('9');
			setEndTime('22');
			goTeamTime({ name });
			setName('');
		}
	}, [name, startTime, endTime, color, joinName]);
	const onPressCloseButton = useCallback(() => {
		dispatch(setModalMode('normal'));
		dispatch(initialError());
		setModalVisible(false);
		setMode('initial');
	}, []);

	const onPressMakeTeam = useCallback((mode: string) => {
		dispatch(setModalMode(mode));
		setMode(mode);
	}, []);
	return (
		<Modal animationType="fade" transparent={true} visible={modalVisible}>
			<KeyboardAvoidingView
				behavior={'padding'}
				enabled={Platform.OS === 'ios' ? true : false}
				style={styles.safeAreaView}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						{!loadingJoin && (
							<>
								<CloseButton closeBtn={onPressCloseButton} />

								{!loadingJoin && mode === 'makeError' && (
									<>
										<View style={styles.errorView}>
											<Material
												name={'error-outline'}
												size={23}
												style={{ alignSelf: 'center' }}
												color={Colors.red300}
											/>
											<Text style={styles.errorText}> 서버 오류</Text>
										</View>
										<View style={styles.blankView} />
										<View style={styles.buttonOverLine} />
										<Button
											buttonNumber={1}
											buttonText="확인"
											onPressFunction={onCloseError}
										/>
									</>
								)}
								{!loadingJoin && mode === 'joinError' && (
									<>
										<View style={styles.errorView}>
											<Material
												name={'error-outline'}
												size={23}
												style={{ alignSelf: 'center' }}
												color={Colors.red300}
											/>

											<Text style={styles.errorText}>
												{' '}
												잘못된 공유 코드 입니다
											</Text>
										</View>
										<View style={styles.blankView} />
										<View style={styles.buttonOverLine} />
										<Button
											buttonNumber={1}
											buttonText="확인"
											onPressFunction={onCloseError}
										/>
									</>
								)}
								{mode === 'join' && modalMode === 'join' && (
									<>
										<Text style={styles.titleText}>공유 코드를 입력하세요</Text>
										<View style={styles.blankView} />
										<View style={[styles.textInputView]}>
											<TextInput
												style={[styles.textInput, { color: Colors.black }]}
												value={code}
												onChangeText={(code) => setCode((text) => code)}
												placeholder="Enter your Code"
												placeholderTextColor={Colors.grey600}
												autoFocus={true}
											/>
										</View>
										<View style={styles.buttonOverLine} />
										<Button
											buttonNumber={1}
											buttonText="확인"
											onPressWithParam={() => onPressNext('send')}
											pressParam="send"
										/>
									</>
								)}
								{mode === 'initial' && (
									<>
										<Text
											style={[
												styles.titleText,
												{ alignSelf: 'flex-start', marginLeft: '10%' },
											]}
										>
											모임 관리
										</Text>
										<View style={styles.blankView} />
										<View style={[styles.backgroundView]}>
											<View style={styles.columnView}>
												<TouchableHighlight
													activeOpacity={1}
													underlayColor={Colors.grey300}
													onPress={() => onPressMakeTeam('make')}
													style={[
														styles.touchButtonStyle,
														{
															borderBottomLeftRadius: 0,
															borderBottomRightRadius: 0,
														},
													]}
												>
													<View style={styles.rowView}>
														<Font5Icon
															name="pencil-alt"
															size={21}
															color={individualColor}
															style={[styles.iconStyle, { marginTop: 10 }]}
														/>
														<Text style={styles.touchText}> 모임 생성</Text>
														<View style={styles.iconView}>
															<Font5Icon
																name="angle-right"
																size={19}
																color={Colors.black}
																style={styles.rightIconStyle}
															/>
														</View>
													</View>
												</TouchableHighlight>

												<TouchableHighlight
													activeOpacity={1}
													underlayColor={Colors.grey300}
													onPress={() => onPressMakeTeam('join')}
													style={[
														styles.touchButtonStyle,
														{
															borderTopLeftRadius: 0,
															borderTopRightRadius: 0,
														},
													]}
												>
													<View style={styles.rowView}>
														<Font5Icon
															name="address-book"
															size={25}
															color={individualColor}
															style={[
																styles.iconStyle,
																{ marginTop: 10, marginLeft: 10 },
															]}
														/>
														<Text
															style={[styles.touchText, { marginLeft: 13 }]}
														>
															모임 참여
														</Text>
														<View style={styles.iconView}>
															<Font5Icon
																name="angle-right"
																size={19}
																color={Colors.black}
																style={styles.rightIconStyle}
															/>
														</View>
													</View>
												</TouchableHighlight>
											</View>
										</View>
										<View style={styles.blankView} />
									</>
								)}
								{mode === 'make' && modalMode === 'make' && (
									<>
										<Text style={[styles.titleText]}> 모임명을 입력하세요</Text>
										<View style={styles.blankView} />
										<View style={[styles.textInputView]}>
											<TextInput
												style={[styles.textInput, { color: Colors.black }]}
												value={name}
												onChangeText={(name) => setName((text) => name)}
												placeholder="We Meet"
												placeholderTextColor={Colors.grey600}
												autoFocus={true}
											/>
										</View>

										<View style={styles.buttonOverLine} />
										<Button
											buttonNumber={1}
											buttonText={'확인'}
											onPressWithParam={() => onPressNext('time')}
											pressParam="time"
										/>
									</>
								)}
							</>
						)}
						{mode === 'time' && (
							<>
								<Text style={styles.titleText}>모임 시간을 입력해 주세요</Text>
								<View style={styles.blankView} />
								<Text style={[styles.titleUnderText]}>
									[ 24시간 단위로 입력해 주세요 ]
								</Text>
								<View style={[styles.rowView, { justifyContent: 'center' }]}>
									<Text style={styles.timeInputText}>시작 시간 : </Text>
									<View style={styles.timeInputView}>
										<TextInput
											style={[styles.timeInput, { color: Colors.black }]}
											value={startTime}
											onChangeText={(hour) => setStartTime((text) => hour)}
											placeholder="09"
											placeholderTextColor={Colors.grey600}
											autoFocus={true}
										/>
									</View>
								</View>
								<View style={styles.blankView} />
								<View style={[styles.rowView, { justifyContent: 'center' }]}>
									<Text style={styles.timeInputText}>종료 시간 : </Text>
									<View style={styles.timeInputView}>
										<TextInput
											style={[styles.timeInput, { color: Colors.black }]}
											value={endTime}
											onChangeText={(hour) => setEndTime((text) => hour)}
											placeholder="22"
											placeholderTextColor={Colors.grey600}
										/>
									</View>
								</View>
								<View style={styles.blankView} />
								<View style={styles.buttonOverLine} />
								<Button
									buttonNumber={2}
									buttonText={'이전'}
									secondButtonText={'다음'}
									onPressWithParam={() => onPressPrev('initial')}
									secondOnPressWithParam={() => onPressNext('color')}
									pressParam="initial"
									secondParam="color"
								/>
							</>
						)}

						{mode === 'color' && (
							<>
								<Text style={styles.titleText}>모임 색상을 선택해 주세요 </Text>
								<View style={styles.blankView} />
								<View
									style={{
										height: 300,
										width: '80%',
									}}
								>
									<ColorPicker
										color={color}
										swatchesOnly={false}
										onColorChange={(color) => setColor(color)}
										onColorChangeComplete={(color) => setColor(color)}
										thumbSize={40}
										sliderSize={40}
										noSnap={false}
										row={false}
										swatchesLast={false}
									/>
								</View>
								<View style={styles.buttonOverLine} />
								<Button
									buttonNumber={2}
									buttonText={'이전'}
									secondButtonText={'다음'}
									onPressWithParam={() => onPressPrev('time')}
									secondOnPressWithParam={() => onPressNext('send')}
									onPressFunction={() => modeChange()}
									pressParam="time"
									secondParam="send"
								/>
							</>
						)}
						{mode === 'loading' && (
							<>
								<View style={{ height: 30 }} />
								<ActivityIndicator size="large" color={individualColor} />
								<View style={{ height: 30 }} />
							</>
						)}
						{mode === 'joinSuccess' && (
							<>
								<View style={styles.blankView} />
								<Text style={[styles.titleText, { fontSize: 17 }]}>
									🎉 모임에 참여가 완료 되었습니다{'\n       '} 가능한 시간을
									입력해주세요
								</Text>
								<View style={styles.blankView} />
								<View style={styles.buttonOverLine} />
								<Button
									buttonNumber={1}
									buttonText={'확인'}
									onPressFunction={onPressClose}
								/>
							</>
						)}
						{mode === 'makeSuccess' && (
							<>
								<View style={styles.blankView} />
								<Text style={[styles.buttonText, { fontSize: 16 }]}>
									🎉 모임 생성 완료 되었습니다 {'\n'} 가능한 시간을 입력해주세요
								</Text>
								<View style={styles.blankView} />
								<View style={styles.buttonOverLine} />
								<Button
									buttonNumber={1}
									buttonText={'확인'}
									onPressFunction={onPressClose}
								/>
							</>
						)}
					</View>
				</View>
			</KeyboardAvoidingView>
			{/* <View style={[{ marginBottom: Platform.select({ ios: 50 }) }]} /> */}
		</Modal>
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
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: screen.width * 0.65,
		height: screen.height * 0.05,
		borderRadius: 13,
	},
	modalView: {
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
	titleText: {
		fontSize: 20,
		alignSelf: 'center',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
	},
	titleUnderText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		marginTop: 0,
		marginBottom: 20,
	},
	errorView: {
		flexDirection: 'row',
		marginTop: 15,
		justifyContent: 'center',
		alignContent: 'center',
	},
	errorText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		fontSize: 15,
		alignSelf: 'center',
	},
	textView: {
		width: '100%',
	},
	textInput: {
		fontSize: 18,
		fontFamily: 'NanumSquareR',
		textAlign: 'center',
	},
	textInputView: {
		paddingBottom: 2,
		borderBottomWidth: 0.3,
		width: '60%',
		justifyContent: 'center',
		textAlign: 'center',

		// marginLeft: '15%',
		padding: 10,
		marginBottom: 15,
	},
	timeInputView: {
		paddingBottom: 2,
		backgroundColor: Colors.white,
		flex: 0.3,
		borderBottomWidth: 0.3,
		marginLeft: '10%',
		textAlign: 'center',
	},
	timeInputText: {
		marginTop: 3,
		fontSize: 14,
		fontFamily: 'NanumSquareR',
	},
	timeInput: {
		fontSize: 18,
		fontFamily: 'NanumSquareR',
		textAlign: 'center',
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
	},

	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},

	modalText: {
		textAlign: 'center',
	},
	verticalLine: {
		height: '50%',
		borderLeftWidth: 0.16,
		width: 1,
	},
	blankView: {
		height: 20,
	},
	rowLine: {
		borderWidth: 0.4,
		width: '110%',
		marginTop: 15,
	},
	buttonOverLine: {
		borderTopWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	safeAreaView: {
		flex: 1,
		// marginTop: 50,
		// justifyContent: 'center',
		// alignItems: 'center',
	},
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100,
	},
	columnView: {
		flexDirection: 'column',
		alignContent: 'center',
	},
	touchButtonStyle: {
		padding: 5,
		borderRadius: 13,
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5,
	},
	iconStyle: {
		marginLeft: 10,
		width: 30,
		height: 30,
		marginTop: 5,
		textAlign: 'center',
		alignContent: 'center',
	},
	touchText: {
		fontSize: 14,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 10,
		top: 1,
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1,
	},
	rightIconStyle: {
		marginRight: 10,
	},
});
