import React, { useCallback, useState, useEffect } from 'react';
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
import { useDispatch } from 'react-redux';
import { inputTeamName, postTeamName } from '../store/team';
import { useAutoFocus } from '../contexts';
//import { MaterialCommunityIcon as Icon } from '../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	changeConfirmTime,
	makeConfirmDates,
	makeInitialTimePicked,
	makePostIndividualDates,
	postConfirm,
	postIndividualTime,
	setEndHour,
	setEndMin,
	setStartMin,
	// setStartPercentage,
} from '../store/timetable';
import { min } from 'react-native-reanimated';
import DropDownPicker from 'react-native-dropdown-picker';
interface props {
	modalVisible: boolean;
	setModalVisible: any;
	start: number;
	end: number;
	mode: string;
	setMode: React.Dispatch<React.SetStateAction<string>>;
	postDatesPrepare?: boolean;
	confirmDatesPrepare?: boolean;
	token: string;
	uri?: string;
	id: number;
	user: number;
	postIndividualDates: any;
	confirmDates: any;
	isTimePicked?: boolean;
	isGroup: boolean;
}

export function ModalMinute({
	modalVisible,
	setModalVisible,
	start,
	end,
	mode,
	setMode,
	postDatesPrepare,
	confirmDatesPrepare,
	token,
	uri,
	user,
	id,
	postIndividualDates,
	confirmDates,
	isTimePicked,
	isGroup,
}: props) {
	const dispatch = useDispatch();
	const [minute, setMinute] = useState('');
	const [startMinute, setStartMinute] = useState(0);
	const [hour, setHour] = useState('');
	const focus = useAutoFocus();

	// 확인 처리 로직
	const onPressConfirm = useCallback(() => {
		if (mode === 'startMinute') {
			dispatch(setStartMin(Number(minute)));
			setStartMinute(Number(minute));
			setMode('endMode');
			setMinute('');
			setModalVisible(true);
		} else {
			if (isGroup) {
				{
					dispatch(setEndMin(Number(minute)));
					if (value === '오후') {
						dispatch(setEndHour(Number(hour) + 12));
					} else if (value === '오전' && Number(hour) < 6) {
						dispatch(setEndHour(Number(hour + 24)));
					} else if (value === '오전' && Number(hour) >= 6) {
						dispatch(setEndHour(Number(hour)));
					}
					setMode('normal');
					setMinute('');
					setHour('');
					setModalVisible(false);
					dispatch(changeConfirmTime());
					dispatch(makeConfirmDates());
				}
			} else {
				{
					dispatch(setEndMin(Number(minute)));
					if (value === '오후') {
						dispatch(setEndHour(Number(hour) + 12));
					} else if (value === '오전' && Number(hour) < 6) {
						dispatch(setEndHour(Number(hour + 24)));
					} else if (value === '오전' && Number(hour) >= 6) {
						dispatch(setEndHour(Number(hour)));
					}
					setMode('normal');
					setMinute('');
					setHour('');
					setModalVisible(false);

					dispatch(makePostIndividualDates());
				}
			}
		}
	}, [minute, mode, hour, isGroup]);
	// 닫기 버튼
	const onPressClose = useCallback(() => {
		setMode('normal');
		setModalVisible(false);
	}, []);
	// 이전 모드
	const onPressPrevMode = useCallback(() => {
		setMode('startMinute');
		// setModalVisible(false);
	}, []);
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('오후');
	const [items, setItems] = useState([
		{ label: '오후', value: '오후' },
		{ label: '오전', value: '오전' },
	]);
	// 개인 시간 전송
	useEffect(() => {
		if (postDatesPrepare && uri) {
			dispatch(
				postIndividualTime({
					dates: postIndividualDates,
					id,
					token,
					uri,
					user,
				})
			);
		}
		// } else if (confirmDatesPrepare && uri) {
		// 	dispatch(postConfirm({ date: confirmDates, id, token, uri, user }));
		// }
	}, [
		postDatesPrepare,
		uri,
		postIndividualDates,
		id,
		token,
		user,
		confirmDates,
	]);

	return (
		// <AutoFocusProvider contentContainerStyle={[styles.keyboardAwareFocus]}>
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
								// position: 'absolute',
								marginLeft: '90%',
								width: '9%',
								marginBottom: 10,
								// backgroundColor: 'blue',
							}}
							onPress={() => {
								onPressClose();
							}}
						>
							<Icon style={{ alignSelf: 'flex-end' }} name="close" size={28} />
						</TouchableHighlight>
						<Text style={styles.titleText}>
							{mode === 'startMinute'
								? '시작 시간의 분을 입력하세요'
								: '종료 시간을 입력하세요'}
						</Text>

						{mode === 'endMode' && (
							<Text style={styles.startTimeText}>
								시작 시간 :
								{mode
									? start <= 12
										? ` 오전 ${start}시 `
										: start >= 24
										? ` 오전 ${start - 24}시 `
										: ` 오후 ${start - 12}시 `
									: end <= 12
									? ` 오전 ${end}시 `
									: end >= 24
									? ` 오전 ${end - 24}시 `
									: ` 오후 ${end - 12}시 `}
								{startMinute} 분
							</Text>
						)}

						{mode === 'endMode' && (
							<View style={[styles.textInputView]}>
								<View style={styles.viewFlex1} />
								<View
									style={{
										flex: 1.0,
										flexShrink: 1.0,
										flexGrow: 1.0,
										flexDirection: 'column',
									}}
								>
									<DropDownPicker
										style={{
											height: 30,
											alignSelf: 'center',
											justifyContent: 'center',
											alignItems: 'center',
										}}
										textStyle={{
											fontFamily: 'NanumSquareR',
										}}
										open={open}
										value={value}
										items={items}
										placeholder={items[0].value}
										setOpen={setOpen}
										setValue={setValue}
										setItems={setItems}
										dropDownDirection="TOP"
									/>
								</View>
								<TextInput
									// onFocus={focus}
									style={[
										styles.textInput,
										{ color: Colors.black, marginLeft: 43 },
									]}
									keyboardType={'number-pad'}
									value={hour}
									onChangeText={(hour) => setHour(hour)}
									placeholder="00"
									placeholderTextColor={Colors.grey600}
								/>
								<Text style={styles.hourText}>{'    :    '}</Text>
								<TextInput
									// onFocus={focus}
									style={[styles.textInput, { color: Colors.black }]}
									keyboardType={'number-pad'}
									value={minute}
									onChangeText={(min) => setMinute(min)}
									placeholder="00"
									placeholderTextColor={Colors.grey600}
								/>
								<View style={styles.viewFlex1} />
							</View>
						)}
						{mode === 'startMinute' && (
							<View style={[styles.textInputView]}>
								<View style={styles.viewFlex1} />
								<Text
									style={[
										styles.hourText,
										{
											flex: 1.0,
											flexShrink: 0.28,
											flexGrow: 0.28,
										},
									]}
								>
									{mode
										? start <= 12
											? `오전 ${start} :`
											: start >= 24
											? `오전 ${start - 24} :`
											: `오후 ${start - 12} :`
										: end <= 12
										? `오전 ${end} :`
										: end >= 24
										? `오전 ${end - 24} :`
										: `오후 ${end - 12} :`}
								</Text>
								<TextInput
									// onFocus={focus}
									style={[styles.textInput, { color: Colors.black, flex: 0.2 }]}
									keyboardType={'number-pad'}
									value={minute}
									onChangeText={(min) => setMinute(min)}
									placeholder="00"
									placeholderTextColor={Colors.grey600}
								/>
								<View style={styles.viewFlex1} />
							</View>
						)}
					</View>
					{mode === 'endMode' ? (
						<>
							<View
								style={{
									marginTop: 0,
									borderTopColor: Colors.grey800,
									borderWidth: 0.3,
									width: '105%',
								}}
							></View>
							<View style={{ flexDirection: 'row' }}>
								<View style={[styles.buttonRowView, { flex: 1 }]}>
									<TouchableHighlight
										activeOpacity={0.1}
										underlayColor={Colors.grey200}
										style={styles.closeButtonStyle}
										onPress={() => {
											onPressPrevMode();
											// setModalVisible(false);
										}}
									>
										<Text style={styles.buttonText}>이전</Text>
									</TouchableHighlight>
								</View>
								<View style={[styles.buttonRowView, { flex: 1 }]}>
									<TouchableHighlight
										activeOpacity={0.1}
										underlayColor={Colors.grey200}
										style={styles.closeButtonStyle}
										onPress={() => {
											onPressConfirm();
											// setModalVisible(false);
										}}
									>
										<Text style={styles.buttonText}>확인</Text>
									</TouchableHighlight>
								</View>
							</View>
						</>
					) : (
						<View style={styles.buttonRowView}>
							<TouchableHighlight
								activeOpacity={0.1}
								underlayColor={Colors.grey200}
								style={styles.closeButtonStyle}
								onPress={() => {
									onPressConfirm();
									// setModalVisible(false);
								}}
							>
								<Text style={styles.buttonText}>확인</Text>
							</TouchableHighlight>
						</View>
					)}
					{/* <ModalMinute /> */}
					{/* {mode === 'startMinute' && (
						<>
							<View style={styles.buttonRowView}>
								<TouchableHighlight
									activeOpacity={0.1}
									underlayColor={Colors.grey200}
									style={styles.closeButtonStyle}
									onPress={() => {
										onPressConfirm();
										// setModalVisible(false);
									}}
								>
									<Text style={styles.buttonText}>확인</Text>
								</TouchableHighlight>
							</View>
						</>
					)} */}
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
		padding: 15,
		alignItems: 'center',
		// shadowColor: '#000',
		shadowColor: 'black',
		shadowOffset: {
			width: 1,
			height: 0.3,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		// elevation: 5,
		width: '82%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareBold',
		fontSize: 21,
		marginBottom: 18,
	},
	startTimeText: {
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		fontSize: 17,
		marginBottom: 18,
	},
	textView: {
		width: '100%',
		//
	},
	hourText: {
		fontSize: 20,
		fontFamily: 'NanumSquareR',
		marginTop: 4,
		// flex: 1,
		// backgroundColor: Colors.red100,
	},
	textInput: {
		fontSize: 22,
		flex: 0.6,
		fontFamily: 'NanumSquareR',
		// marginTop: -2,
		alignSelf: 'center',
		borderWidth: 0.3,
		padding: 2,
		// marginTop: -4,
		// marginLeft: -3,
		// marginRight: -3,
		textAlign: 'center',

		borderColor: Colors.blue300,
		borderRadius: 8,
	},
	textInputView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		alignSelf: 'center',
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
		marginBottom: 0,
		// flex: 1,
		// flexGrow: 0.5,
		// flexShrink: 0.5,
		// backgroundColor: Colors.red200,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	closeButtonStyle: {
		// width: '40%',
		// height: '100%',
		borderRadius: 8,
		// backgroundColor: Colors.blue300,
		padding: 12,
		flex: 1,
	},
	acceptButtonStyle: {
		padding: 15,
		// width: '50%',
		// height: '100%',
		borderRadius: 10,
		// backgroundColor: Colors.blue400,
	},
	modalText: {
		// marginBottom: 15,
		textAlign: 'center',
	},
	verticalLine: {
		// height: '50%',
		borderLeftWidth: 0.16,
		width: 1,
	},
	viewFlex1: {
		flex: 0.1,
	},
});
