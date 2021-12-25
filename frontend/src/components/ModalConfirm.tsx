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
import { hexToRGB } from '../lib/util/hexToRGB';
import { ColorPicker, fromHsv } from 'react-native-color-picker';
import { changeColor, leaveTeam, setModalMode } from '../store/team';
import { Button } from '../lib/util/Button';
import {
	changeTimetableColor,
	getSnapShot,
	setConfirmCount,
} from '../store/timetable';
import { getUserMe, makeGroupColor } from '../store/login';
import { useNavigation } from '@react-navigation/core';

const screen = Dimensions.get('screen');

interface props {
	confirmModalVisible: boolean;
	setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
	color: string;
	name: string;
	uri: string;
}

export function ModalConfirm({
	confirmModalVisible,
	setConfirm,
	color,
	name,
	uri,
}: props) {
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');
	const [confirmCount, setCount] = useState('1');
	const navigation = useNavigation();
	// useCallback
	const onPressCloseBtn = useCallback(() => {
		setConfirm(false);
		setMode('initial');
		setCount('1');
	}, []);
	const onPressMoveConfirmPage = useCallback(() => {
		setConfirm(false);
		dispatch(setConfirmCount(Number(confirmCount)));
		navigation.navigate('SnapShot', {
			name,
			color,
			timetableMode: 'confirm',
			isConfirm: true,
			uri,
			confirmCount,
		});
	}, [confirmCount]);
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={confirmModalVisible}
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
							onPress={onPressCloseBtn}
						>
							<Icon style={{ alignSelf: 'flex-end' }} name="close" size={25} />
						</TouchableHighlight>
					</View>
					<>
						{mode === 'initial' && (
							<>
								<Text style={styles.titleText}>모임 시간을 정하셨나요?</Text>
								<View style={styles.buttonOverLine} />
								<Button
									buttonNumber={2}
									buttonText="취소"
									secondButtonText="다음"
									onPressFunction={onPressCloseBtn}
									secondOnPressWithParam={() => setMode('count')}
									secondParam={'count'}
								/>
							</>
						)}
						{mode === 'count' && (
							<>
								<Text style={styles.titleText}>일주일에 몇 번 만나세요?</Text>
								<View style={styles.blankView} />
								<View style={{ flexDirection: 'row' }}>
									<View style={[styles.textInputView]}>
										<TextInput
											// onFocus={focus}
											style={[styles.textInput, { color: Colors.black }]}
											value={confirmCount}
											keyboardType="number-pad"
											onChangeText={(count) => setCount((number) => count)}
											placeholderTextColor={Colors.grey600}
											autoFocus={true}
										/>
									</View>
									<Text
										style={[
											styles.textInput,
											{ alignSelf: 'center', padding: 5, marginBottom: 5 },
										]}
									>
										번
									</Text>
								</View>
								<View style={styles.buttonOverLine} />
								<Button
									buttonNumber={2}
									buttonText="취소"
									secondButtonText="확인"
									onPressFunction={onPressCloseBtn}
									secondOnPressFunction={onPressMoveConfirmPage}
								/>
							</>
						)}
					</>
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
		fontSize: 18,
		alignSelf: 'center',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '10%',
		marginTop: 15,
		textAlign: 'center',
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
		marginTop: 25,
		borderColor: Colors.black,
	},
	iconStyle: {
		marginLeft: 10,
	},
	rightIconStyle: {
		marginRight: 10,
	},
	textInputView: {
		paddingBottom: 2,
		backgroundColor: Colors.white,
		borderBottomWidth: 0.3,
		width: '15%',
		justifyContent: 'center',
		padding: 10,
		textAlign: 'center',
		marginBottom: 15,
		flexDirection: 'row',
	},
	textInput: {
		fontSize: 18,
		fontFamily: 'NanumSquareR',
		textAlign: 'center',
	},
});
