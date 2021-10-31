import React, { useCallback, useState } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	TextInput,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { inputTeamName, postTeamName } from '../store/team';
//import { MaterialCommunityIcon as Icon } from '../theme';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginEveryTime } from '../store/individual';
import type { RootState } from '../store';
interface props {
	selectModalVisible: boolean;
	setSelectModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalSelect({
	selectModalVisible,
	setSelectModalVisible,
}: props) {
	const { everyTime, id, name } = useSelector(
		({ individual, login }: RootState) => ({
			// dates: timetable.dates,
			everyTime: individual.everyTime,
			id: login.id,
			name: login.name,
		})
	);
	const dispatch = useDispatch();
	const [mode, setMode] = useState('normal');
	const [loginID, setID] = useState('');
	const [password, setPassword] = useState('');

	const onPressLogin = useCallback(() => {
		dispatch(loginEveryTime({ id: loginID, password: password }));
		setSelectModalVisible(false);
		setMode('normal');
	}, [id, password]);
	// const onChangeInput = useCallback(() => {
	// 	dispatch(inputTeamName(name));
	// 	dispatch(postTeamName({ user, id, name, token }));
	// 	setName('');
	// }, [name]);

	return (
		// <AutoFocusProvider contentContainerStyle={[styles.keyboardAwareFocus]}>
		<Modal
			animationType="fade"
			transparent={true}
			visible={selectModalVisible}
			onRequestClose={() => {
				Alert.alert('Modal has been closed.');
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
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
							underlayColor={Colors.grey200}
							style={{
								marginLeft: '90%',
								width: '9%',
							}}
							onPress={() => {
								setSelectModalVisible(false);
							}}
						>
							<Icon style={{ alignSelf: 'flex-end' }} name="close" size={28} />
						</TouchableHighlight>
						{mode === 'normal' && (
							<View>
								<Text style={styles.titleText}>
									시간표 등록 방법을 선택하세요
								</Text>
								<View style={{ flexDirection: 'row' }}>
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey200}
										style={styles.iconTouchableView}
										onPress={() => {
											setMode('everytime');
										}}
									>
										<View style={{ flexDirection: 'column' }}>
											<IonicIcon
												name="alarm-outline"
												size={28}
												color="#CF2C1E"
												style={{ alignSelf: 'center' }}
											/>
											<Text style={styles.iconUnderText}>에브리 타임</Text>
										</View>
									</TouchableHighlight>
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey200}
										style={styles.iconTouchableView}
										onPress={() => {}}
									>
										<View style={{ flexDirection: 'column' }}>
											<AntIcon
												name="picture"
												size={28}
												color={Colors.green400}
												style={{ alignSelf: 'center' }}
											/>
											<Text style={styles.iconUnderText}>갤러리</Text>
										</View>
									</TouchableHighlight>
								</View>
							</View>
						)}
						{mode === 'everytime' && (
							<View>
								{/* <Text style={styles.titleText}>에브리 타임</Text> */}
								<View
									style={[
										styles.textView,
										{
											marginBottom: 10,
										},
									]}
								>
									<View style={[styles.textInputView]}>
										<Icon
											name="account"
											size={28}
											style={{
												// marginTop: 5,
												paddingRight: 10,
											}}
										/>
										<TextInput
											style={[styles.textInput]}
											value={loginID}
											onChangeText={(loginID) => setID((text) => loginID)}
											autoCapitalize="none"
											placeholder="ID"
											placeholderTextColor={Colors.grey800}
										/>
									</View>
								</View>
								<View style={{ marginBottom: 15 }} />
								<View style={[styles.textView]}>
									<View style={[styles.textInputView]}>
										<Icon
											name="lock"
											size={28}
											style={{
												// marginTop: 5,
												paddingRight: 10,
											}}
										/>
										<TextInput
											autoCapitalize="none"
											autoCompleteType="password"
											secureTextEntry={true}
											style={[styles.textInput]}
											value={password}
											onChangeText={(userPw) => setPassword((text) => userPw)}
											placeholder="PASSWORD"
											placeholderTextColor={Colors.grey800}
										/>
									</View>
								</View>
								<View style={styles.buttonRowView}>
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey200}
										style={styles.closeButtonStyle}
										onPress={onPressLogin}
									>
										<Text style={styles.buttonText}>로그인</Text>
									</TouchableHighlight>
								</View>
							</View>
						)}
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
		// paddingBottom: 60,
		marginBottom: 60,
		backgroundColor: 'white',
		borderRadius: 13,
		padding: 20,
		alignItems: 'center',
		// shadowColor: '#000',
		shadowColor: 'black',
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		// elevation: 5,
		width: '85%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginBottom: 15,
	},
	textView: {
		width: '100%',
		//
	},
	textInput: {
		fontSize: 19,
		flex: 1,
		fontFamily: 'NanumSquareR',
		marginLeft: '0%',
	},
	textInputView: {
		flexDirection: 'row',
		borderRadius: 10,
		padding: 10,
		borderWidth: 1,
		borderColor: Colors.blue200,
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
		width: '50%',
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
		textAlign: 'center',
	},
	verticalLine: {
		height: '50%',
		borderLeftWidth: 0.16,
		width: 1,
	},
	iconTouchableView: {
		flex: 1,
		height: 80,
		borderWidth: 1,
		borderColor: Colors.blue300,
		justifyContent: 'center',
		borderRadius: 10,
	},
	iconUnderText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 5,
	},
});
