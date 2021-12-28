import React, { useCallback } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	ActivityIndicator,
	Dimensions,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from '../lib/util/Button';

const screen = Dimensions.get('screen');

interface props {
	loadingVisible: boolean;
	setLoadingVisible: React.Dispatch<React.SetStateAction<boolean>>;
	loadingMode: string;
	setLoading: React.Dispatch<React.SetStateAction<string>>;
	color: string;
	onPressOk: () => void;
	onPressRevertOk: () => void;
	goLeft: () => void;
}

export function ModalLoading({
	loadingVisible,
	setLoadingVisible,
	color,
	loadingMode,
	setLoading,
	onPressRevertOk,
	onPressOk,
	goLeft,
}: props) {
	const dispatch = useDispatch();

	const onPressCloseBtn = useCallback(() => {
		setLoadingVisible(false);
	}, []);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={loadingVisible}
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
					{loadingMode === 'initial' && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowView}>
								<Font5Icon
									name="check-circle"
									size={21}
									color={Colors.green500}
								/>
								<Text style={styles.touchText}>
									{' '}
									모임 시간을 확정 하시겠습니까?
								</Text>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={2}
								buttonText="취소"
								secondButtonText="확인"
								onPressFunction={onPressCloseBtn}
								secondOnPressFunction={onPressOk}
								// onPressFunction={onFinishChangeColor}
							/>
						</>
					)}
					{loadingMode === 'revert' && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowView}>
								<Font5Icon
									name="check-circle"
									size={21}
									color={Colors.green500}
								/>
								<Text style={styles.touchText}>
									{' '}
									모임 시간을 되돌리시겠습니까?
								</Text>
							</View>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={2}
								buttonText="취소"
								secondButtonText="확인"
								onPressFunction={onPressCloseBtn}
								secondOnPressFunction={onPressRevertOk}
								// onPressFunction={onFinishChangeColor}
							/>
						</>
					)}
					{loadingMode === 'loading' && (
						<>
							<View style={styles.blankView} />
							<ActivityIndicator size={'large'} color={color} />
							<View style={styles.blankView} />
						</>
					)}
					{loadingMode === 'success' && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowView}>
								<Font5Icon
									name="check-circle"
									size={19}
									color={Colors.green500}
								/>
								<Text style={[styles.touchText, { fontSize: 14 }]}>
									{' 변경 사항이 저장 되었습니다'}
								</Text>
							</View>
							<Text style={[styles.touchText, { fontSize: 14 }]}>
								이제 설정 버튼을 눌러 알람을 추가할 수 있습니다.
							</Text>
							<View style={styles.blankView} />
							<View style={styles.buttonOverLine} />
							<Button
								buttonNumber={1}
								buttonText="확인"
								onPressFunction={goLeft}
							/>
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
		marginTop: -20,
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',

		justifyContent: 'center',
		width: screen.width * 0.53,
	},
	columnView: {
		flexDirection: 'column',

		borderRadius: 13,
		alignContent: 'center',
		margin: 30,
		marginBottom: 20,
		marginTop: 20,
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
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 10,
		justifyContent: 'center',
		textAlignVertical: 'center',
		// alignSelf: 'center',
		// alignContent: 'center',
		// alignItems: 'center',
	},
	titleText: {
		fontSize: 20,
		textAlign: 'left',
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '8%',
	},
	blankView: {
		height: 10,
	},
	textView: {
		width: '100%',
	},
	touchButtonStyle: {
		padding: 5,
		borderRadius: 10,
		// alignItems: 'center',
		// alignContent: 'center',
		// alignSelf: 'center',
		justifyContent: 'center',
	},
	buttonOverLine: {
		borderTopWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
});
