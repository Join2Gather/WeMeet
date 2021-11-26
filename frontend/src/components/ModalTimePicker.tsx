import React, { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	TextInput,
	Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch } from 'react-redux';
import {
	changeAllColor,
	changeConfirmTime,
	makeConfirmDates,
	makePostIndividualDates,
	postConfirm,
	postIndividualTime,
	setEndHour,
	setEndMin,
	setStartMin,
} from '../store/timetable';
import dayjs from 'dayjs';
import { Colors } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { App } from './Time';
import { useIsDarkMode } from '../hooks';
interface props {
	modalVisible: boolean;
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>> | null;
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
	date: Date;
	setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export function ModalTimePicker({
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
	date,
	setDate,
}: props) {
	const dispatch = useDispatch();

	const [minute, setMinute] = useState(0);
	const [hour, setHour] = useState(0);
	const { isDark } = useIsDarkMode();
	// useEffect(() => {
	// 	console.log(start);
	// 	date.setHours(start);
	// 	setDate(new Date(date));
	// }, [start]);
	const onPressConfirm = useCallback(() => {
		const timeHour = date.getHours();
		const timeMinute = date.getMinutes();
		// setDate(new Date(dayjsDate));

		setHour(date.getHours());
		setMinute(date.getMinutes());

		if (mode === 'startMinute') {
			dispatch(setStartMin(timeMinute));
			setMode('endMode');
			setModalVisible && setModalVisible(true);
		} else {
			if (isGroup) {
				{
					// dispatch(setEndMin(Number(date.getMinutes)));
					dispatch(setEndHour(timeHour));
					dispatch(changeConfirmTime());
					dispatch(makeConfirmDates());
				}
			} else {
				{
					dispatch(setEndMin(timeMinute));
					dispatch(setEndHour(timeHour));
					dispatch(changeAllColor());
					dispatch(makePostIndividualDates());
				}
			}
			setMode('normal');
			setModalVisible && setModalVisible(false);
		}
	}, [minute, mode, hour, isGroup, date]);

	// 닫기 버튼
	const onPressClose = useCallback(() => {
		setModalVisible && setModalVisible(false);
		setMode('normal');
	}, [setModalVisible, modalVisible]);
	// 이전 모드
	const onPressPrevMode = useCallback(() => {
		setMode('startMinute');
		// setModalVisible(false);
	}, []);
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
		} else if (confirmDatesPrepare && uri) {
			dispatch(postConfirm({ date: confirmDates, id, token, uri, user }));
		}
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
		// <Modal
		// 	animationType="fade"
		// 	transparent={true}
		// 	visible={modalVisible}
		// 	onRequestClose={() => {
		// 		Alert.alert('Modal has been closed.');
		// 	}}
		// >
		// 	<View style={styles.centeredView}>
		// 		<View style={styles.modalView}>
		// 			<View
		// 				style={[
		// 					styles.textView,
		// 					{
		// 						marginBottom: 10,
		// 					},
		// 				]}
		// 			/>
		// 			{/* <TouchableHighlight
		// 				activeOpacity={1}
		// 				underlayColor={Colors.white}
		// 				style={{
		// 					// position: 'absolute',
		// 					marginLeft: '90%',
		// 					width: '9%',
		// 					marginBottom: 10,
		// 					// backgroundColor: 'blue',
		// 				}}
		// 				onPress={() => {
		// 					onPressClose();
		// 				}}
		// 			>
		// 				<Icon style={{ alignSelf: 'flex-end' }} name="close" size={28} />
		// 			</TouchableHighlight> */}
		// 			<Text style={styles.titleText}>
		// 				{mode === 'startMinute'
		// 					? '시작 시간을 입력하세요'
		// 					: '종료 시간을 입력하세요'}
		// 			</Text>
		<DateTimePickerModal
			confirmTextIOS="확인"
			cancelTextIOS="취소"
			display="spinner"
			isVisible={modalVisible}
			mode="time"
			date={date}
			// isDarkModeEnabled={false}
			onChange={(date) => setDate(date)}
			textColor={isDark ? Colors.white : Colors.black}
			onConfirm={onPressConfirm}
			onCancel={onPressClose}
		/>
		// <View style={{ height: 100 }} />
		/* <View style={{ flex: 1 }}>
						<DateTimePicker
							testID="dateTimePicker"
							value={dates}
							mode={'countdown'}
							is24Hour={true}
							display="clock"
							onChange={onChange}
							// style={{ flex: 1 }}
						/>
					</View> */

		/* {mode === 'endMode' ? (
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
					)} */
		// 		</View>
		// 	</View>
		// </Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 3,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 50,
	},
	modalView: {
		margin: 10,
		paddingBottom: 60,
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
		width: '94%',
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
