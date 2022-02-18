import React, { useCallback } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import { Button } from '../theme/Button';
import { CloseButton, ModalView } from '../theme';

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
	onPressRevertOk,
	onPressOk,
	goLeft
}: props) {
	const onPressCloseBtn = useCallback(() => {
		setLoadingVisible(false);
	}, []);

	return (
		<ModalView
			modalVisible={loadingVisible}
			ModalViewRender={() => (
				<>
					<CloseButton closeBtn={onPressCloseBtn} />
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
				</>
			)}
		/>
	);
}

const styles = StyleSheet.create({
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: screen.width * 0.53
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
	touchText: {
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 10,
		justifyContent: 'center',
		textAlignVertical: 'center'
	},
	titleText: {
		fontSize: 20,
		textAlign: 'left',
		justifyContent: 'flex-start',
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '8%'
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
