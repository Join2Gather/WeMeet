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
	ActivityIndicator
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Material from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	initialIndividualError,
	loginEveryTime,
	postEveryTime
} from '../store/individual';
import type { RootState } from '../store';
import { setModalMode } from '../store/team';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import { Button } from '../theme/Button';
import { CloseButton } from '../theme';

const screen = Dimensions.get('screen');

interface props {
	selectModalVisible: boolean;
	setSelectModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	mode: string;
	setMode: React.Dispatch<React.SetStateAction<string>>;
	color: string;
}

export function ModalSelect({
	selectModalVisible,
	setSelectModalVisible,
	mode,
	setMode,
	color
}: props) {
	const {
		everyTime,
		id,
		user,
		loadingLogin,
		loginSuccess,
		token,
		inThemeColor,
		loginError
	} = useSelector(({ individual, login, loading }: RootState) => ({
		// dates: timetable.dates,
		everyTime: individual.everyTime,
		id: login.id,
		user: login.user,
		loadingLogin: loading['individual/POST_EVERYTIME'],
		loginSuccess: individual.loginSuccess,
		token: login.token,
		inThemeColor: login.inThemeColor,
		loginError: individual.error
	}));
	const dispatch = useDispatch();

	const [loginID, setID] = useState('');
	const [password, setPassword] = useState('');

	const onPressLogin = useCallback(() => {
		dispatch(loginEveryTime({ id: loginID, password: password }));
		setMode('loading');
		// setTimeout(() => setMode('loading2'), 500);
	}, [loginID, password]);
	const onPressCloseBtn = useCallback(() => {
		setModalMode('normal');
		setMode('normal');
		setSelectModalVisible(false);
		dispatch(initialIndividualError());
	}, []);
	useEffect(() => {
		if (loginSuccess) {
			dispatch(postEveryTime({ id, user, data: everyTime, token }));
			setMode('loading2');
			setTimeout(() => setMode('success'), 500);
		}
	}, [loginSuccess, id, user, everyTime, token]);
	useEffect(() => {
		loginError === 'everyTime' && setMode('error');
	}, [loginError]);
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
					<CloseButton closeBtn={onPressCloseBtn} />

					{mode === 'everytime' && (
						<>
							<View style={styles.blankView} />
							{/* <Text style={styles.titleText}>에브리 타임</Text> */}
							<View
								style={[
									styles.textView,
									{
										marginBottom: 10
									}
								]}
							>
								<View
									style={[
										styles.textInputView,
										,
										{ borderColor: inThemeColor }
									]}
								>
									<Icon
										name="account"
										size={25}
										color={inThemeColor}
										style={{
											// marginTop: 5,
											paddingRight: 10
										}}
									/>
									<TextInput
										style={[styles.textInput]}
										value={loginID}
										onChangeText={(loginID) => setID((text) => loginID)}
										autoCapitalize="none"
										placeholder="ID"
										placeholderTextColor={Colors.grey600}
									/>
								</View>
							</View>
							<View style={{ marginBottom: 15 }} />
							<View style={[styles.textView]}>
								<View
									style={[
										styles.textInputView,
										,
										{ borderColor: inThemeColor }
									]}
								>
									<Icon
										name="lock"
										size={25}
										color={inThemeColor}
										style={{
											// marginTop: 5,
											paddingRight: 10
										}}
									/>
									<TextInput
										autoCapitalize="none"
										autoCompleteType="password"
										// secureTextEntry={true}
										style={[styles.textInput]}
										value={password}
										onChangeText={(userPw) => setPassword((text) => userPw)}
										placeholder="PASSWORD"
										placeholderTextColor={Colors.grey600}
									/>
								</View>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonRowView}>
								{/* <TouchableHighlight
									activeOpacity={1}
									underlayColor={Colors.grey200}
									style={styles.closeButtonStyle}
									onPress={onPressLogin}
								>
									<Text style={styles.buttonText}>로그인</Text>
								</TouchableHighlight> */}
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="로그인"
								onPressFunction={onPressLogin}
							/>
						</>
					)}
					{mode === 'loading' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
							<Text style={[styles.buttonText, { marginTop: 15 }]}>
								로그인 중
							</Text>
							<View style={styles.blankView} />
						</>
					)}
					{mode === 'loading2' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
							<Text style={[styles.buttonText, { marginTop: 15 }]}>
								동기화 중
							</Text>
							<View style={styles.blankView} />
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
								<Text style={styles.touchText}>
									{' '}
									시간표 연동이 완료 되었습니다
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
					{mode === 'error' && (
						<>
							<View style={styles.blankView} />
							<View style={[styles.rowView, { justifyContent: 'center' }]}>
								<Material
									name={'error-outline'}
									size={25}
									color={Colors.red300}
								/>
								<Text style={styles.touchText}> 로그인 실패</Text>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={onPressCloseBtn}
							/>
							<View />
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
		marginTop: -20
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
			height: 1
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		width: screen.width * 0.9
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginBottom: 15
	},
	textView: {
		width: '100%'
		// marginLeft: '5%',
		//
	},
	textInput: {
		fontSize: 16,
		flex: 1,
		fontFamily: 'NanumSquareR',
		marginLeft: '0%',
		color: Colors.black
	},
	textInputView: {
		flexDirection: 'row',
		borderBottomWidth: 2,
		padding: 3,

		width: '70%',
		marginLeft: '20%'
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR'
	},
	buttonRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
		marginBottom: -13
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	closeButtonStyle: {
		padding: 0,
		width: '100%',
		height: '100%',
		borderRadius: 13
	},
	acceptButtonStyle: {
		padding: 15,
		width: '50%',
		height: '100%',
		borderRadius: 10
	},
	modalText: {
		textAlign: 'center'
	},
	verticalLine: {
		height: '50%',
		borderLeftWidth: 0.16,
		width: 1
	},
	iconTouchableView: {
		flex: 1,
		height: 80,
		borderWidth: 3,
		justifyContent: 'center',
		borderRadius: 15
	},
	iconUnderText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 5
	},
	touchButtonStyle: {
		padding: 5,
		borderRadius: 13,
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1
	},
	rightIconStyle: {
		marginRight: 10
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: screen.width * 0.65,
		height: screen.height * 0.05,
		borderRadius: 13
	},
	touchText: {
		fontSize: 14,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 10,
		top: 1
	},
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100
	},
	columnView: {
		flexDirection: 'column',
		alignContent: 'center'
	},
	blankView: {
		height: 15
	},
	buttonOverLine: {
		borderTopWidth: 0.4,
		width: '112%',
		marginTop: 20,
		borderColor: Colors.black
	}
});
