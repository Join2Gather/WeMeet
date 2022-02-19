import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import { Button } from '../theme/Button';
import { setTimeTipVisible, setTipMode } from '../store/login';
import { RootState } from '../store';
import { CloseButton, ModalView } from '../theme';

const screen = Dimensions.get('screen');

interface props {
	infoVisible: boolean;
	setInfoVisible: React.Dispatch<React.SetStateAction<boolean>>;
	seeTips: boolean;
	color?: string;
}

export function ModalInfo({
	infoVisible,
	setInfoVisible,
	seeTips,
	color
}: props) {
	const { seeTimeTips, uri, timeTipVisible } = useSelector(
		({ timetable, login }: RootState) => ({
			seeTimeTips: login.seeTimeTips,
			uri: timetable.teamURI,
			timeTipVisible: login.timeTipVisible
		})
	);
	const dispatch = useDispatch();
	const onPressCloseBtn = useCallback(() => {
		dispatch(setTimeTipVisible(false));
	}, []);

	return (
		<ModalView
			modalVisible={timeTipVisible}
			ModalViewRender={() => (
				<>
					<CloseButton closeBtn={onPressCloseBtn} />
					<View style={{ justifyContent: 'center' }}>
						<View style={styles.blankView} />

						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.touchText}></Text>
							<View
								style={{
									height: 15,
									width: 30,
									backgroundColor: Colors.white,
									borderWidth: 0.5
								}}
							/>
							<Text style={[styles.touchText, { marginLeft: 2 }]}>
								{'색이 없는 시간이나, + 버튼을 눌러 시간을\n추가할 수 있어요'}
							</Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Text style={styles.touchText}></Text>
							<View
								style={{
									height: 15,
									width: 15,
									backgroundColor: color
								}}
							/>
							<View
								style={{
									height: 15,
									width: 15,
									backgroundColor: Colors.grey400
								}}
							/>
							<Text style={[styles.touchText, { marginLeft: 2 }]}>
								{
									'색이 있는 시간을 터치 하면 시간에 대한\n정보를 확인 할 수 있어요'
								}
							</Text>
						</View>

						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Text style={styles.touchText}></Text>
							<Icon name="check-bold" color={color} size={17}></Icon>
							<Text style={[styles.touchText, { marginLeft: 0 }]}>
								{' '}
								아이콘을 터치 하여 일정 확정이 가능해요
							</Text>
						</View>
						<View style={{ flexDirection: 'row', marginTop: 15 }}>
							<Text style={styles.touchText}></Text>
							<FontIcon color={color} name="user-plus" size={17}></FontIcon>
							<Text
								style={[styles.touchText, { marginLeft: 0, marginRight: 3 }]}
							>
								{' '}
								{
									'설정 창에서 아이콘을 터치하여 \n 팀원 초대 코드를 생성할 수 있어요'
								}
							</Text>

							<Text style={[styles.touchText, { marginLeft: 0 }]}>{''}</Text>
						</View>
						<View
							style={{ flexDirection: 'row', marginTop: 10, marginLeft: 3 }}
						>
							<Text style={styles.touchText}></Text>
							<FontIcon
								color={color}
								name="question-circle"
								size={17}
								style={{ marginTop: -2, marginLeft: -2 }}
							></FontIcon>
							<Text
								style={[
									styles.touchText,
									{ color: Colors.grey700, marginLeft: 1, marginRight: 3 }
								]}
							>
								{' '}
								{' 도움말 아이콘을 터치 하여 언제나 다시\n 확인 할 수 있어요'}
							</Text>
						</View>

						<View style={styles.blankView} />
						<View style={styles.buttonOverLine} />
						<Button
							buttonNumber={1}
							buttonText="확인"
							onPressFunction={onPressCloseBtn}
						/>
					</View>
				</>
			)}
		/>
		// </AutoFocusProvider>
	);
}

const styles = StyleSheet.create({
	iconView: {
		alignItems: 'flex-end',
		flex: 1
	},

	touchText: {
		fontSize: 14,
		textAlign: 'left',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: screen.width * 0.15,
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center'
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
