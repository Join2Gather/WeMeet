import React, { useCallback, useState } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	Dimensions
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Material from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../theme/Button';
import { setTipMode } from '../store/login';
import { RootState } from '../store';
import Ionic from 'react-native-vector-icons/Ionicons';
import { CloseButton } from '../theme';

const screen = Dimensions.get('screen');

interface props {
	infoVisible: boolean;
	setInfoVisible: React.Dispatch<React.SetStateAction<boolean>>;
	seeTips: boolean;
	color?: string;
}

export function ModalHomeInfo({
	infoVisible,
	setInfoVisible,
	seeTips,
	color
}: props) {
	const { inColor, seeTimeTips } = useSelector(
		({ timetable, login }: RootState) => ({
			inColor: login.inThemeColor,
			seeTimeTips: login.seeTimeTips
		})
	);
	const dispatch = useDispatch();
	const onPressTipBtn = useCallback(() => {
		dispatch(setTipMode(!seeTips));
	}, [seeTips]);
	const onPressCloseBtn = useCallback(() => {
		setInfoVisible(false);
	}, []);

	const [infoMode, setInfoMode] = useState('');

	return (
		<Modal animationType="fade" transparent={true} visible={infoVisible}>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<CloseButton closeBtn={onPressCloseBtn} />

					<View style={{ justifyContent: 'flex-start' }}>
						<Text
							style={[
								styles.touchText,
								{ marginLeft: screen.width * 0.15 + 1 }
							]}
						>
							WE MEET에 오신걸 환영 합니다 😆
						</Text>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Text style={styles.touchText}></Text>
							<Material color={inColor} name="settings" size={17}></Material>
							<Text
								style={[styles.touchText, { marginLeft: 0, marginRight: 3 }]}
							>
								{' '}
								{'설정 아이콘을 터치하여 닉네임과 테마 색상\n 변경이 가능 해요'}
							</Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Text style={styles.touchText}></Text>
							<Ionic
								color={inColor}
								name="menu"
								size={17}
								style={{ marginTop: -2 }}
							></Ionic>
							<Text
								style={[styles.touchText, { marginLeft: 0, marginRight: 3 }]}
							>
								{' '}
								{'메뉴 아이콘을 터치 하여 다양한 정보를 확인 \n 할 수 있어요'}
							</Text>
						</View>

						<View
							style={{ flexDirection: 'row', marginTop: 10, marginLeft: 3 }}
						>
							<Text style={styles.touchText}></Text>
							<FontIcon
								color={inColor}
								name="question-circle"
								size={17}
								style={{ marginTop: -2 }}
							></FontIcon>
							<Text
								style={[
									styles.touchText,
									{ color: Colors.grey700, marginLeft: 1, marginRight: 3 }
								]}
							>
								{' '}
								{'도움말 아이콘을 터치 하여 언제나 다시\n 확인 할 수 있어요'}
							</Text>
						</View>
						{/* <TouchableHighlight
							style={[
								styles.rowView,
								{
									justifyContent: 'center',
									marginTop: 20,
								},
							]}
							underlayColor={Colors.white}
							onPress={onPressTipBtn}
						>
							<>
								{seeTips ? (
									<Material
										name={'check-box-outline-blank'}
										color={inColor}
										size={20}
									/>
								) : (
									<Material name={'check-box'} color={inColor} size={20} />
								)}
								<Text style={[styles.touchText, { marginLeft: 0 }]}>
									다시 보지 않기
								</Text>
							</>
						</TouchableHighlight> */}
						<View style={styles.blankView} />
						<View style={styles.buttonOverLine} />
						<Button
							buttonNumber={1}
							buttonText="확인"
							onPressFunction={onPressCloseBtn}
						/>
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
		marginTop: -20
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',

		justifyContent: 'center'
		// width: screen.width * 0.53,
	},
	columnView: {
		flexDirection: 'column',

		borderRadius: 13,
		alignContent: 'center',
		margin: 30,
		marginBottom: 20,
		marginTop: 20
	},
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1
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
	touchText: {
		fontSize: 14,
		textAlign: 'left',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: screen.width * 0.15
	},
	titleText: {
		fontSize: 20,
		textAlign: 'left',
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1
	},
	blankView: {
		height: 10
	},
	textView: {
		width: '100%'
	},
	touchButtonStyle: {
		padding: 5,
		borderRadius: 10,
		justifyContent: 'center'
	},
	buttonOverLine: {
		borderTopWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black
	}
});
