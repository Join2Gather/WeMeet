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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { hexToRGB } from '../lib/util/hexToRGB';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import { changeColor, leaveTeam, setModalMode } from '../store/team';
import { Button } from '../lib/util/Button';
import { changeTimetableColor, getSnapShot } from '../store/timetable';
import { getUserMe, makeGroupColor } from '../store/login';
import { useNavigation } from '@react-navigation/core';
import MakeAlarm from '../lib/util/MakeAlarm';
import { ModalDatePicker } from './ModalDatePicker';

const screen = Dimensions.get('screen');

interface props {
	settingModalVisible: boolean;
	setSettingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
	user: number;
	id: number;
	token: string;
	color: string;
	uri?: string;
	loadingChangeColor: [prop: string];
	createdDate: string;
	name: string;
	onShareURI: () => void;
	snapShotError: boolean;
	isConfirmProve: boolean;
	dateVisible: boolean;
	setDateVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ModalSetting({
	settingModalVisible,
	setSettingModalVisible,
	user,
	id,
	token,
	color,
	uri,
	createdDate,
	name,
	onShareURI,
	snapShotError,
	isConfirmProve,
	dateVisible,
	setDateVisible,
}: props) {
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');
	const [subMode, setSubMode] = useState('initial');
	const [alarmTime, setAlarmTime] = useState('1');
	const [pickColor, setPickColor] = useState(Colors.red500);

	// const [color, setColor] = useState(Colors.red500);
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});
	const navigation = useNavigation();
	useEffect(() => {
		if (mode === 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 500);
		} else if (mode === 'loadingSave') {
			setTimeout(() => {
				setMode('snapShot');
			}, 500);
		} else if (mode === 'loadingLeave') {
			setTimeout(() => {
				setMode('successLeave');
			}, 500);
			dispatch(getUserMe({ id, token, user }));
		}
	}, [mode]);

	// useCallback
	useEffect(() => {
		const result = hexToRGB(color);
		result && setRGBColor(result);
	}, [color]);
	const onPressCloseButton = useCallback(() => {
		setSettingModalVisible(false);
		setMode('initial');
	}, []);

	const onPressSetMode = useCallback((mode: string) => {
		setMode(mode);
	}, []);
	// 팀 색 변경
	const onPressChangeColor = useCallback(() => {
		uri && dispatch(changeColor({ color: pickColor, id, token, user, uri }));
		dispatch(getUserMe({ id, token, user }));
		dispatch(makeGroupColor(pickColor));

		setMode('loading');
	}, [pickColor]);
	const onPressGetSnapShot = useCallback(() => {
		uri && dispatch(getSnapShot({ id, token, user, uri }));
		setMode('loadingSave');
	}, []);
	const onFinishChangeColor = useCallback(() => {
		dispatch(changeTimetableColor(pickColor));
		setPickColor(Colors.red500);
		setSettingModalVisible(false);
		setMode('initial');
	}, [pickColor]);

	const goSnapShotPage = useCallback(() => {
		setSettingModalVisible(false);
		setModalMode('initial');
		navigation.navigate('SnapShot', { name, color });
	}, [color]);
	const onPressLeaveTeam = useCallback(() => {
		uri && dispatch(leaveTeam({ id, token, uri, user }));
		setMode('loadingLeave');
	}, []);
	const onCloseLeaveTeam = useCallback(() => {
		setMode('initial');
		navigation.goBack();
		setSettingModalVisible(false);
	}, []);

	const onPressMakeAlarm = useCallback(() => {
		setMode('alarm');
		// const add = MakeAlarm({title, });
	}, []);
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
							<View style={styles.blankView} />
							<Text style={styles.titleText}>팀 설정</Text>
							<View style={styles.blankView} />
							<View style={[styles.backgroundView]}>
								<View style={styles.columnView}>
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey300}
										onPress={() => onPressSetMode('color')}
										style={[
											styles.touchButtonStyle,
											{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
										]}
									>
										<View style={styles.rowView}>
											<Font5Icon
												name="palette"
												size={21}
												color={color}
												style={[styles.iconStyle, { marginTop: 10 }]}
											/>
											<Text style={styles.touchText}> 팀 색상 변경</Text>
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
										onPress={onShareURI}
										style={[
											styles.touchButtonStyle,
											{ borderTopLeftRadius: 0, borderTopRightRadius: 0 },
										]}
									>
										<View style={styles.rowView}>
											<Font5Icon
												name="user-plus"
												size={20}
												color={color}
												style={[styles.iconStyle, { marginTop: 10 }]}
											/>
											<Text style={styles.touchText}>팀원 초대</Text>
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
							<Text style={styles.titleText}>개인 설정</Text>
							<View style={styles.blankView} />
							<View style={[styles.backgroundView]}>
								<View style={styles.columnView}>
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey300}
										onPress={onPressGetSnapShot}
										style={[
											styles.touchButtonStyle,
											{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
										]}
									>
										<View style={styles.rowView}>
											<Font5Icon
												name="cloud-download-alt"
												size={17}
												color={color}
												style={[styles.iconStyle, { marginTop: 15 }]}
											/>

											<Text style={styles.touchText}>저장 시간 불러오기</Text>
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
										onPress={onPressMakeAlarm}
										style={[styles.touchButtonStyle, { borderRadius: 0 }]}
									>
										<View style={styles.rowView}>
											<Ionicons
												name="alarm"
												size={25}
												color={color}
												style={styles.iconStyle}
											/>
											<Text style={styles.touchText}>알람 추가하기</Text>
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
										onPress={onPressLeaveTeam}
										style={[
											styles.touchButtonStyle,
											{ borderTopLeftRadius: 0, borderTopRightRadius: 0 },
										]}
									>
										<View style={styles.rowView}>
											<FontIcon
												name="close"
												size={25}
												color={color}
												style={styles.iconStyle}
											/>
											<Text style={styles.touchText}>모임에서 나가기</Text>
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
						</>
					)}
					{mode === 'color' && (
						<>
							<Text style={styles.titleText}>모임 색상을 선택해 주세요</Text>
							<View style={styles.blankView} />
							<Text
								style={[
									styles.titleText,
									{ color: Colors.red500, fontSize: 13, marginTop: 0 },
								]}
							>
								주의 사항 : 팀원 전체의 모임 색이 변경되게 됩니다
							</Text>
							<View style={styles.blankView} />
							<View style={styles.blankView} />
							<View
								style={{
									height: 200,
									width: '80%',
								}}
							>
								<ColorPicker
									onColorSelected={(color) => alert(`Color selected: ${color}`)}
									onColorChange={(color) => setPickColor(fromHsv(color))}
									style={{ flex: 1 }}
									hideSliders={true}
								/>
							</View>
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={2}
								buttonText={'이전'}
								secondButtonText={'확인'}
								onPressWithParam={() => setMode('initial')}
								pressParam="initial"
								secondOnPressFunction={() => onPressChangeColor()}
							/>
						</>
					)}
					{mode === 'snapShot' && (
						<>
							<View style={styles.blankView} />
							<Text style={[styles.titleText]}>저장 시간 불러오기</Text>

							<View style={styles.blankView} />
							<View style={[styles.backgroundView]}>
								<View style={styles.columnView}>
									{snapShotError && (
										<TouchableHighlight
											activeOpacity={1}
											underlayColor={Colors.grey300}
											// onPress={goSnapShotPage}
											style={styles.touchButtonStyle}
										>
											<View style={styles.rowView}>
												<Font5Icon
													name="ban"
													size={23}
													color={Colors.red500}
													style={styles.iconStyle}
												/>
												<Text style={styles.touchText}>
													저장된 시간이 없습니다
												</Text>
											</View>
										</TouchableHighlight>
									)}
									{!snapShotError && (
										<View>
											<TouchableHighlight
												activeOpacity={1}
												underlayColor={Colors.grey300}
												onPress={goSnapShotPage}
												style={styles.touchButtonStyle}
											>
												<View style={styles.rowView}>
													<Font5Icon
														name="save"
														size={23}
														color={color}
														style={styles.iconStyle}
													/>
													<Text style={styles.touchText}>{createdDate}</Text>
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
									)}
								</View>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText={'이전'}
								onPressWithParam={() => setMode('initial')}
								pressParam="initial"
							/>
							{/* <View style={styles.blankView} /> */}
						</>
					)}
					{mode === 'alarm' && (
						<>
							{!isConfirmProve && (
								<>
									<View style={styles.blankView} />
									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey300}
										// onPress={goSnapShotPage}
										style={styles.touchButtonStyle}
									>
										<View style={styles.rowView}>
											<Font5Icon
												name="ban"
												size={23}
												color={Colors.red500}
												style={styles.iconStyle}
											/>
											<Text style={styles.touchText}>
												아직 모임 시간이 정해지지 않았습니다
											</Text>
										</View>
									</TouchableHighlight>
									<View style={styles.blankView} />
									<View style={styles.buttonOverLine} />

									<Button
										buttonNumber={1}
										buttonText={'이전'}
										onPressWithParam={() => setMode('initial')}
										pressParam="initial"
									/>
								</>
							)}
							{isConfirmProve && subMode === 'initial' && (
								<>
									<Text style={styles.titleText}>
										캘린더 아이콘을 터치 하여 주세요
									</Text>

									<TouchableHighlight
										activeOpacity={1}
										underlayColor={Colors.grey300}
										onPress={() => {
											setSettingModalVisible(false);
											setDateVisible(true);
										}}
										style={styles.touchButtonStyle}
									>
										<View style={styles.rowView}>
											<Font5Icon
												name="calendar-alt"
												size={23}
												color={color}
												style={styles.iconStyle}
											/>
											<Text style={styles.touchText}>{'종료일 설정'}</Text>
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

									<Button
										buttonNumber={1}
										buttonText="확인"
										// onPressWithParam={() => onPressNext('send')}
										pressParam="send"
									/>
								</>
							)}
							{isConfirmProve && subMode === 'time' && (
								<>
									<Text style={styles.titleText}>
										알람을 모임 몇 시간 전으로 설정 할까요?
									</Text>

									<View style={[styles.textInputView]}>
										<TextInput
											// onFocus={focus}
											keyboardType="number-pad"
											style={[styles.textInput, { color: Colors.black }]}
											value={alarmTime}
											onChangeText={(time) => setAlarmTime((text) => time)}
											placeholder="1"
											placeholderTextColor={Colors.grey600}
											autoFocus={true}
										/>
									</View>

									<Button
										buttonNumber={1}
										buttonText="확인"
										// onPressWithParam={() => onPressNext('send')}
										pressParam="send"
									/>
								</>
							)}
						</>
					)}
					{mode === 'loading' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
							<View style={styles.blankView} />
						</>
					)}
					{mode === 'loadingSave' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
							<View style={styles.blankView} />
						</>
					)}
					{mode === 'loadingLeave' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
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
									변경 사항이 저장 되었습니다
								</Text>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />

							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={onFinishChangeColor}
							/>
						</>
					)}
					{mode === 'successLeave' && (
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
									변경 사항이 저장 되었습니다
								</Text>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={onCloseLeaveTeam}
							/>
						</>
					)}
				</View>
			</View>
			<ModalDatePicker
				dateVisible={dateVisible}
				setDateVisible={setDateVisible}
			/>
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
		fontSize: 14,
		textAlign: 'center',
		textAlignVertical: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 10,
		top: 1,
	},
	titleText: {
		fontSize: 20,
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '10%',
		marginTop: 15,
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
	iconStyle: {
		marginLeft: 10,
		width: 30,
		height: 30,
		// backgroundColor: Colors.blue100,
		marginTop: 5,
		textAlign: 'center',

		alignContent: 'center',
	},
	rightIconStyle: {
		marginRight: 10,
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
	textInput: {
		fontSize: 18,
		fontFamily: 'NanumSquareR',
	},
});
