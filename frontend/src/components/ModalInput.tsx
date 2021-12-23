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
import {
	changeColor,
	initialError,
	inputTeamName,
	joinTeam,
	postTeamName,
	setModalMode,
} from '../store/team';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Material from 'react-native-vector-icons/MaterialIcons';
import { getUserMe } from '../store/login';
import { makeTeamTime, setTimeMode } from '../store/timetable';
import { Button } from '../lib/util/Button';
import { Sequence } from './Sequence';
import { current } from '@reduxjs/toolkit';
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
	const [startTime, setStartTime] = useState('9');
	const [endTime, setEndTime] = useState('22');
	const [currentNumber, setCurrent] = useState(0);

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
		dispatch(setTimeMode('make'));
		dispatch(initialError());
		setModalVisible(false);
		setColor(Colors.red500);
		dispatch(getUserMe({ id, token, user }));
	}, []);
	const onPressClose = useCallback(() => {
		dispatch(initialError());
		dispatch(getUserMe({ id, token, user }));
		setModalVisible(false);
		setMode('initial');
		setCurrent(0);
		if (modalMode === 'join') {
			const uri = joinUri;
			goTeamTime(uri);
			setCode('');
		} else if (modalMode === 'make') {
			setColor(Colors.red500);
			setStartTime('9');
			setEndTime('22');
			goTeamTime(name);
			setName('');
		}
	}, [name, startTime, endTime, color, joinName]);
	const onPressCloseButton = useCallback(() => {
		dispatch(setModalMode('make'));
		dispatch(initialError());
		setModalVisible(false);
		setMode('initial');
	}, []);
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
				Alert.alert('Modal has been closed.');
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					{!loadingJoin && (
						<View
							style={[
								styles.textView,
								{
									marginBottom: 10,
								},
							]}
						>
							<>
								<TouchableHighlight
									activeOpacity={1}
									underlayColor={Colors.white}
									style={{
										marginLeft: '90%',
										width: '9%',
									}}
									onPress={onPressCloseButton}
								>
									<Icon
										style={{ alignSelf: 'flex-end' }}
										name="close"
										size={25}
									/>
								</TouchableHighlight>
								<View style={styles.blankView} />
								<Sequence
									color={individualColor}
									currentNumber={currentNumber}
									mode={sequence}
								/>
								<View style={styles.blankView} />
							</>

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
									<Button
										buttonNumber={1}
										buttonText="확인"
										onPressFunction={onCloseError}
									/>
									<View style={styles.blankView} />
								</>
							)}
							{mode === 'initial' && modalMode === 'join' && (
								<>
									<Text style={styles.titleText}>공유 코드를 입력하세요</Text>

									<View style={[styles.textInputView]}>
										<TextInput
											// onFocus={focus}
											style={[styles.textInput, { color: Colors.black }]}
											value={code}
											onChangeText={(code) => setCode((text) => code)}
											placeholder="Enter your Code"
											placeholderTextColor={Colors.grey600}
											autoFocus={true}
										/>
									</View>

									<Button
										buttonNumber={1}
										buttonText="확인"
										onPressWithParam={() => onPressNext('send')}
										pressParam="send"
									/>
								</>
							)}
							{mode === 'initial' && modalMode === 'make' && (
								<>
									<Text style={styles.titleText}>모임명을 입력하세요</Text>
									<View style={[styles.textInputView]}>
										<TextInput
											// onFocus={focus}
											style={[styles.textInput, { color: Colors.black }]}
											value={name}
											onChangeText={(name) => setName((text) => name)}
											placeholder="Enter your ID"
											placeholderTextColor={Colors.grey600}
											autoFocus={true}
										/>
									</View>

									<Button
										buttonNumber={1}
										buttonText={'확인'}
										onPressWithParam={() => onPressNext('time')}
										pressParam="time"
									/>
								</>
							)}
						</View>
					)}
					{mode === 'time' && (
						<>
							<Text style={styles.titleText}>모임 시간을 입력해 주세요</Text>
							<Text style={[styles.titleUnderText]}>
								[ 24시간 단위로 입력해 주세요 ]
							</Text>
							<View style={styles.rowView}>
								<Text style={styles.timeInputText}>시작 시간 : </Text>
								<View style={styles.timeInputView}>
									<TextInput
										// onFocus={focus}123
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
							<View style={styles.rowView}>
								<Text style={styles.timeInputText}>종료 시간 : </Text>
								<View style={styles.timeInputView}>
									<TextInput
										// onFocus={focus}
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
							<View
								style={{
									height: 200,
									width: '80%',
								}}
							>
								<ColorPicker
									onColorSelected={(color) => alert(`Color selected: ${color}`)}
									onColorChange={(color) => setColor(fromHsv(color))}
									style={{ flex: 1 }}
									hideSliders={true}
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
							<ActivityIndicator size="large" color={Colors.blue500} />
							<View style={{ height: 30 }} />
						</>
					)}
					{mode === 'joinSuccess' && (
						<>
							<Text style={[styles.titleText, { fontSize: 17 }]}>
								🎉 모임에 참여가 완료 되었습니다 {'\n'} 가능한 시간을
								입력해주세요
							</Text>
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
							<Text style={[styles.titleText, { fontSize: 17 }]}>
								🎉 모임 생성 완료 되었습니다 {'\n'} 가능한 시간을 입력해주세요
								{'\n'}
							</Text>
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText={'확인'}
								onPressFunction={onPressClose}
							/>
						</>
					)}

					{/* <View style={styles.buttonRowView}>
						<TouchableHighlight
							activeOpacity={0.1}
							underlayColor={Colors.grey200}
							style={styles.closeButtonStyle}
							onPress={() => {
								joinTeamError
									? onCloseError()
									: mode === '3'
									? onMoveTeamTime()
									: onChangeInput();
							}}
						>
							<Text style={styles.buttonText}>확인</Text>
						</TouchableHighlight>
					</View> */}
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
		alignContent: 'center',
		justifyContent: 'center',
		width: '50%',
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
		width: '90%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 20,

		marginBottom: 20,
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
	},
	textInputView: {
		paddingBottom: 2,
		backgroundColor: Colors.white,
		borderBottomWidth: 0.3,
		width: '70%',
		marginLeft: '15%',
		padding: 10,
		marginBottom: 15,
	},
	timeInputView: {
		paddingBottom: 2,
		backgroundColor: Colors.white,
		flex: 0.6,
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
});
