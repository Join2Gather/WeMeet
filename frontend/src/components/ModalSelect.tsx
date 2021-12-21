import React, { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	TextInput,
	Dimensions,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import AntIcon from 'react-native-vector-icons/AntDesign';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginEveryTime, postEveryTime } from '../store/individual';
import type { RootState } from '../store';
import { setModalMode } from '../store/team';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';

const screen = Dimensions.get('screen');

interface props {
	selectModalVisible: boolean;
	setSelectModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalSelect({
	selectModalVisible,
	setSelectModalVisible,
}: props) {
	const { everyTime, id, user, loadingLogin, loginSuccess, token } =
		useSelector(({ individual, login, loading }: RootState) => ({
			// dates: timetable.dates,
			everyTime: individual.everyTime,
			id: login.id,
			user: login.user,
			loadingLogin: loading['individual/POST_EVERYTIME'],
			loginSuccess: individual.loginSuccess,
			token: login.token,
		}));
	const dispatch = useDispatch();
	const [mode, setMode] = useState('normal');
	const [loginID, setID] = useState('');
	const [password, setPassword] = useState('');

	const onPressLogin = useCallback(() => {
		dispatch(loginEveryTime({ id: loginID, password: password }));
		setSelectModalVisible(false);
		setMode('normal');
	}, [loginID, password]);
	const onPressCloseBtn = useCallback(() => {
		setModalMode('normal');
		setMode('normal');
		setSelectModalVisible(false);
	}, []);
	useEffect(() => {
		loginSuccess &&
			dispatch(
				postEveryTime({ id: id, user: user, data: everyTime, token: token })
			);
	}, [loginSuccess, id, user, everyTime, token]);
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
					{mode === 'normal' && (
						<View>
							<View style={styles.blankView} />
							<Text style={styles.titleText}>
								시간표 등록 방법을 선택하세요
							</Text>
							<View style={{ height: 20 }} />
							<View style={styles.backgroundView}>
								<View style={styles.columnView}>
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey200}
										style={[
											styles.touchButtonStyle,
											{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
										]}
										onPress={() => {
											setMode('everytime');
										}}
									>
										<View style={styles.rowView}>
											<IonicIcon
												name="alarm-outline"
												size={28}
												color="#CF2C1E"
												style={{ marginLeft: 10 }}
											/>
											<Text style={styles.touchText}>에브리 타임</Text>
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
										underlayColor={Colors.grey200}
										style={[
											styles.touchButtonStyle,
											{ borderTopLeftRadius: 0, borderTopRightRadius: 0 },
										]}
										onPress={() => {}}
									>
										<View style={styles.rowView}>
											<AntIcon
												name="picture"
												size={28}
												color={Colors.green400}
												style={{ marginLeft: 10 }}
											/>
											<Text style={styles.touchText}>갤러리</Text>
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
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginBottom: 15,
	},
	textView: {
		width: '90%',
		marginLeft: '5%',
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
		borderRadius: 15,
		padding: 10,
		borderWidth: 1,
		borderColor: Colors.blue200,
		// marginLeft: '5%',
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
		borderWidth: 3,
		justifyContent: 'center',
		borderRadius: 15,
	},
	iconUnderText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 5,
	},
	touchButtonStyle: {
		padding: 5,
		borderRadius: 13,
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5,
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1,
	},
	rightIconStyle: {
		marginRight: 10,
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: screen.width * 0.65,
		height: screen.height * 0.05,
		borderRadius: 13,
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
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100,
	},
	columnView: {
		flexDirection: 'column',
		alignContent: 'center',
	},
	blankView: {
		height: 15,
	},
});
