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
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import {
	changeColor,
	initialError,
	inputTeamName,
	joinTeam,
	postTeamName,
} from '../store/team';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import Material from 'react-native-vector-icons/MaterialIcons';
import { getUserMe } from '../store/login';
import { getColor } from '../store/timetable';
interface props {
	modalVisible: boolean;
	setModalVisible: any;
	user: number;
	id: number;
	token: string;
	goTeamTime: Function;
	modalMode: string;
	setModalMode: React.Dispatch<React.SetStateAction<string>>;
	loadingJoin: string[];
	loadingChangeColor: string[];
	joinTeamError: boolean;
	postTeamError: boolean;
	joinUri: string;
	joinName: string;
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
	setModalMode,
	joinName,
}: props) {
	const dispatch = useDispatch();
	// const [name, setName] = useState('2ff148e7-05b9-461e-a2c2-1d3ccce16ba9');
	const [name, setName] = useState('ea55df07-e437-4ce4-baf7-29ee28aa579d');
	const [mode, setMode] = useState('1');
	const [color, setColor] = useState(Colors.red500);

	// useEffect
	useEffect(() => {
		if (joinTeamError) setMode('joinError');
		else if (mode === 'loading' && modalMode === 'join') setMode('3');

		if (postTeamError) setMode('makeError');
		else if (mode === 'loading' && modalMode === 'make') setMode('2');
	}, [joinTeamError, postTeamError, mode, modalMode]);
	// useCallback
	const onChangeInput = useCallback(() => {
		if (mode === '1') {
			dispatch(initialError());
			if (modalMode === 'join') {
				dispatch(joinTeam({ id: id, token: token, user: user, uri: name }));
				setMode('loading');
			} else if (modalMode === 'make') {
				dispatch(inputTeamName(name));
				dispatch(postTeamName({ user, id, name, token }));
				setTimeout(() => {
					setMode('loading');
				}, 1000);
			}
		} else if (mode === '2') {
			// dispatch(getColor(color));
			goTeamTime(name);
			dispatch(changeColor({ color, id, token, uri: joinUri, user }));
			setMode('1');
			setModalVisible(false);
			dispatch(getUserMe({ id, token, user }));
		}
		setName('');
	}, [name, modalMode, mode, color, id, token, joinUri, user]);
	const onCloseError = useCallback(() => {
		setMode('1');
		dispatch(initialError());
		setModalVisible(false);
	}, []);
	const onPressClose = useCallback(() => {
		setModalMode('make');
		dispatch(initialError());
		setModalVisible(false);
		setMode('1');
	}, []);
	const onMoveTeamTime = useCallback(() => {
		setModalVisible(false);
		setMode('1');
		setModalMode('make');
		goTeamTime(joinName);
	}, [joinName]);
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
					{loadingJoin && <ActivityIndicator size="large" />}
					{!loadingJoin && (
						<View
							style={[
								styles.textView,
								{
									marginBottom: 10,
								},
							]}
						>
							<TouchableHighlight
								activeOpacity={1}
								underlayColor={Colors.white}
								style={{
									marginLeft: '90%',
									width: '9%',
								}}
								onPress={onPressClose}
							>
								<Icon
									style={{ alignSelf: 'flex-end' }}
									name="close"
									size={28}
								/>
							</TouchableHighlight>
							{!loadingJoin && mode === 'makeError' && (
								<View style={styles.errorView}>
									<Material
										name={'error-outline'}
										size={23}
										style={{ alignSelf: 'center' }}
										color={Colors.red300}
									/>
									<Text style={styles.errorText}> 서버 오류</Text>
								</View>
							)}
							{!loadingJoin && mode === 'joinError' && (
								<View style={styles.errorView}>
									<Material
										name={'error-outline'}
										size={23}
										style={{ alignSelf: 'center' }}
										color={Colors.red300}
									/>
									<Text style={styles.errorText}> 잘못된 공유 코드 입니다</Text>
								</View>
							)}
							{mode === '1' && modalMode === 'join' && (
								<>
									<Text style={styles.titleText}>공유 코드를 입력하세요</Text>

									<View style={[styles.textInputView]}>
										<TextInput
											// onFocus={focus}
											style={[styles.textInput, { color: Colors.black }]}
											value={name}
											onChangeText={(name) => setName((text) => name)}
											placeholder="Enter your Code"
											placeholderTextColor={Colors.grey600}
										/>
									</View>
								</>
							)}
							{mode === '1' && modalMode === 'make' && (
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
										/>
									</View>
								</>
							)}
						</View>
					)}
					{mode === '2' && (
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
						</>
					)}
					{mode === '3' && (
						<Text style={[styles.titleText, { fontSize: 18 }]}>
							🎉 모임에 참여가 완료 되었습니다 {'\n'} 가능한 시간을 입력해주세요
						</Text>
					)}
					<View style={styles.buttonRowView}>
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
					</View>
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
	modalView: {
		margin: 10,
		marginBottom: 60,
		backgroundColor: 'white',
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
		width: '85%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginTop: 10,
		marginBottom: 15,
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
		fontSize: 19,
		flex: 1,
		fontFamily: 'NanumSquareR',
		marginLeft: '0%',
	},
	textInputView: {
		flexDirection: 'row',
		paddingBottom: 0.7,
		borderBottomWidth: 0.3,
		width: '70%',
		marginLeft: '15%',
		padding: 10,
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
	},
	buttonRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: -13,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	closeButtonStyle: {
		padding: 15,
		width: '80%',
		height: '100%',
		borderRadius: 13,
	},
	acceptButtonStyle: {
		padding: 15,
		width: '50%',
		height: '100%',
		borderRadius: 10,
	},
	modalText: {
		// marginBottom: 15,
		textAlign: 'center',
	},
	verticalLine: {
		height: '50%',
		borderLeftWidth: 0.16,
		width: 1,
	},
});
