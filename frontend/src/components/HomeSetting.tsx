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
	TextInput,
	Platform,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionic from 'react-native-vector-icons/Ionicons';
import { hexToRGB } from '../lib/util/hexToRGB';
import { Button } from '../theme/Button';
import Material from 'react-native-vector-icons/MaterialIcons';
import {
	changeNickname,
	changeTeamColor,
	getUserMe,
	setInTimeColor,
	toggleViewError,
} from '../store/login';
import ColorPicker from 'react-native-wheel-color-picker';
import { setIndividualTimeColor } from '../store/individual';
const screen = Dimensions.get('screen');

interface props {
	settingModalVisible: boolean;
	setSettingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	user: number;
	id: number;
	token: string;
	color: string;
	inTimeColor: string;
	userMeError: string;
	onPressChangeTime: () => void;
	isViewError: boolean;
}

export function HomeSetting({
	settingModalVisible,
	setSettingModalVisible,
	user,
	id,
	token,
	color,
	inTimeColor,
	userMeError,
	onPressChangeTime,
	isViewError,
}: props) {
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');
	const [pickColor, setPickColor] = useState(Colors.red500);
	const [inPickColor, setInPickColor] = useState(inTimeColor);
	const [nickname, setNickname] = useState('');
	// const [color, setColor] = useState(Colors.red500);
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});
	useEffect(() => {
		userMeError && setMode('error');
	}, [userMeError, mode]);
	useEffect(() => {
		if (mode === 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 1000);
		}
	}, [mode]);
	useEffect(() => {
		const result = hexToRGB(color);
		result && setRGBColor(result);
	}, [color]);
	const onPressCloseButton = useCallback(() => {
		setSettingModalVisible(false);
		setMode('initial');
		setNickname('');
	}, []);

	const onChangeColor = useCallback(() => {
		dispatch(changeTeamColor(pickColor));
		setMode('loading');
	}, [pickColor]);

	const onChangeInColor = useCallback(() => {
		dispatch(setInTimeColor(inPickColor));
		dispatch(setIndividualTimeColor(inPickColor));
		dispatch(getUserMe({ token }));
		setMode('loading');
	}, [inPickColor]);

	const onPressNickConfirm = useCallback(() => {
		dispatch(changeNickname({ id, token, user, nickname }));
		setMode('loading');
		setTimeout(() => {
			setNickname('');
		}, 100);
	}, [nickname]);
	const onPressConfirm = useCallback(() => {
		setMode('initial');
		setSettingModalVisible(false);
		setPickColor(Colors.red500);
	}, []);

	const onPressIsViewError = useCallback(() => {
		dispatch(toggleViewError(!isViewError));
		setMode('loading');
	}, [isViewError]);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={settingModalVisible}
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
							onPress={onPressCloseButton}
						>
							<Icon style={{ alignSelf: 'flex-end' }} name="close" size={25} />
						</TouchableHighlight>
					</View>

					{mode === 'initial' && (
						<>
							<>
								{/* <View style={styles.blankView} /> */}
								<Text style={styles.titleText}>계정 설정</Text>
								<View style={styles.blankView} />
								<View style={[styles.backgroundView]}>
									<View style={styles.columnView}>
										<TouchableHighlight
											activeOpacity={1}
											underlayColor={Colors.grey300}
											onPress={() => setMode('nickname')}
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
													name="user-edit"
													size={21}
													color={color}
													style={styles.iconStyle}
												/>
												<Text style={styles.touchText}> 닉네임 변경</Text>
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
											onPress={onPressChangeTime}
											style={[
												styles.touchButtonStyle,
												{
													borderRadius: 0,
												},
											]}
										>
											<View style={styles.rowView}>
												<Ionic
													name="time"
													size={25}
													color={color}
													style={[styles.iconStyle, { marginLeft: 8 }]}
												/>
												<Text style={styles.touchText}> 홈 시간 설정</Text>
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
										{Platform.OS === 'android' && (
											<TouchableHighlight
												activeOpacity={1}
												underlayColor={Colors.grey300}
												onPress={() => setMode('timeError')}
												style={[
													styles.touchButtonStyle,
													{
														borderRadius: 0,
													},
												]}
											>
												<View style={styles.rowView}>
													<Ionic
														name="time"
														size={25}
														color={color}
														style={[styles.iconStyle, { marginLeft: 8 }]}
													/>
													<Text style={styles.touchText}>
														{' '}
														시간표 오류 수정
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
										)}
										<TouchableHighlight
											activeOpacity={1}
											underlayColor={Colors.grey300}
											style={[styles.touchButtonStyle, { borderRadius: 0 }]}
											onPress={() => setMode('inColor')}
										>
											<View style={styles.rowView}>
												<Material
													name="format-color-fill"
													size={21}
													color={color}
													style={styles.iconStyle}
												/>
												<Text style={styles.touchText}>
													{' '}
													개인 일정 색상 변경
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
										<TouchableHighlight
											activeOpacity={1}
											underlayColor={Colors.grey300}
											style={[
												styles.touchButtonStyle,
												{ borderTopLeftRadius: 0, borderTopRightRadius: 0 },
											]}
											onPress={() => setMode('color')}
										>
											<View style={styles.rowView}>
												<Font5Icon
													name="palette"
													size={21}
													color={color}
													style={styles.iconStyle}
												/>
												<Text style={styles.touchText}> 테마 색상 변경</Text>
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
						</>
					)}
					{mode === 'color' && (
						<>
							<Text style={[styles.titleText, { justifyContent: 'center' }]}>
								테마 색상을 선택해 주세요
							</Text>
							<View style={styles.blankView} />

							<View style={styles.blankView} />
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
									onColorChange={(color) => setPickColor(color)}
									onColorChangeComplete={(color) => setPickColor(color)}
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
								secondButtonText={'확인'}
								onPressWithParam={() => setMode('initial')}
								pressParam="initial"
								secondOnPressFunction={onChangeColor}
							/>
						</>
					)}
					{mode === 'inColor' && (
						<>
							<Text style={[styles.titleText, { justifyContent: 'center' }]}>
								개인 일정 색상을 선택해 주세요
							</Text>
							<View style={styles.blankView} />

							<View style={styles.blankView} />
							<View style={styles.blankView} />
							<View
								style={{
									height: 300,
									width: '80%',
								}}
							>
								<ColorPicker
									color={inTimeColor}
									swatchesOnly={false}
									onColorChange={(color) => setInPickColor(color)}
									onColorChangeComplete={(color) => setInPickColor(color)}
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
								secondButtonText={'확인'}
								onPressWithParam={() => setMode('initial')}
								pressParam="initial"
								secondOnPressFunction={onChangeInColor}
							/>
						</>
					)}
					{mode === 'nickname' && (
						<>
							<Text style={[styles.titleText, { alignSelf: 'center' }]}>
								닉네임을 입력해 주세요
							</Text>
							<View style={styles.blankView} />

							<View style={[styles.textInputView]}>
								<TextInput
									// onFocus={focus}
									style={[styles.textInput, { color: Colors.black }]}
									value={nickname}
									onChangeText={(nickname) => setNickname((text) => nickname)}
									placeholder="Enter your Nickname"
									placeholderTextColor={Colors.grey600}
									autoFocus={true}
									autoCapitalize="none"
								/>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={2}
								buttonText={'이전'}
								secondButtonText={'확인'}
								onPressWithParam={() => setMode('initial')}
								pressParam="initial"
								secondOnPressFunction={onPressNickConfirm}
							/>
						</>
					)}
					{mode === 'loading' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
							<View style={styles.blankView} />
						</>
					)}
					{mode === 'timeError' && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowView}>
								<Text style={styles.touchText}>
									시간표에 흰색줄이 표시 되시나요?
								</Text>
							</View>

							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={2}
								buttonText="아니요"
								secondButtonText="네"
								onPressFunction={onPressCloseButton}
								secondOnPressFunction={onPressIsViewError}
							/>
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

							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={onPressConfirm}
							/>
						</>
					)}
					{mode === 'error' && (
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
								onPressFunction={() => {
									setSettingModalVisible(false);
									setMode('error');
								}}
							/>
						</>
					)}
				</View>
			</View>
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
	columnView: {
		flexDirection: 'column',
		alignContent: 'center',
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
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		position: 'absolute',
		left: '16%',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	titleText: {
		fontSize: 20,
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '10%',
		// marginTop: 15,
	},
	blankView: {
		height: 15,
	},
	textView: {
		width: '100%',
	},
	touchButtonStyle: {
		padding: 5,
		borderRadius: 13,
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5,
	},
	buttonOverLine: {
		borderTopWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	textInputView: {
		paddingBottom: 2,
		backgroundColor: Colors.white,
		borderBottomWidth: 0.3,
		width: '70%',
		marginLeft: '10%',
		padding: 10,
	},
	textInput: {
		fontSize: 18,
		fontFamily: 'NanumSquareR',
	},
	iconStyle: {
		marginLeft: 10,
	},
	rightIconStyle: {
		marginRight: 10,
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
});
