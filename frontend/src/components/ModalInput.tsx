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
import { MaterialCommunityIcon as Icon, TouchableView } from '../theme';
import type { FC } from 'react';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { inputTeamName } from '../store/team';
import { AutoFocusProvider, useAutoFocus } from '../contexts';

export function ModalInput({ modalVisible, setModalVisible }) {
	const dispatch = useDispatch();
	const [name, setName] = useState('');
	const focus = useAutoFocus();

	const onChangeInput = useCallback(() => {
		dispatch(inputTeamName(name));
	}, [name]);

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
					</View>
					<View style={styles.buttonRowView}>
						<TouchableHighlight
							activeOpacity={0.1}
							underlayColor={Colors.grey200}
							style={styles.closeButtonStyle}
							onPress={() => {
								setModalVisible(false);
							}}
						>
							<Text style={styles.buttonText}>확인</Text>
						</TouchableHighlight>
						<View style={styles.verticalLine} />
						<TouchableHighlight
							activeOpacity={1}
							underlayColor={Colors.grey200}
							style={styles.acceptButtonStyle}
							onPress={() => {
								setModalVisible(false);
							}}
						>
							<Text style={styles.buttonText}>취소</Text>
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
		elevation: 5,
		width: '85%',
	},
	titleText: {
		textAlign: 'center',
		fontFamily: 'SCDream2',
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

		// borderBottomWidth: 1,
		fontFamily: 'SCDream2',
		marginLeft: '0%',
	},
	textInputView: {
		flexDirection: 'row',
		paddingBottom: 0.7,
		borderBottomWidth: 0.3,
		width: '90%',
		marginLeft: '5%',
		// borderRadius: 10,
		padding: 10,
	},
	buttonText: {
		textAlign: 'center',
		fontFamily: 'SCDream2',
	},
	buttonRowView: {
		// flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 10,
		// justifyContent: 'center',
		// alignContent: 'center',
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
		// backgroundColor: Colors.grey400,
	},
	acceptButtonStyle: {
		padding: 15,
		width: '50%',
		height: '100%',
		borderRadius: 10,
		// backgroundColor: Colors.blue400,
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