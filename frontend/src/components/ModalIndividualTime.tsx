import React, { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	Dimensions,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hexToRGB } from '../lib/util/hexToRGB';
import type { findTime } from '../interface/timetable';
import { deletePostTime, setTimeModalMode } from '../store/timetable';
const screen = Dimensions.get('screen');

interface props {
	inModalVisible?: boolean;
	setInModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	color?: string;
	findIndividual: findTime[];
}

export function ModalIndividualTime({
	inModalVisible,
	setInModalVisible,
	color,
	findIndividual,
}: props) {
	const dispatch = useDispatch();
	const [mode, setMode] = useState('initial');
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});
	useEffect(() => {
		if (mode == 'loading') {
			setTimeout(() => {
				setMode('success');
			}, 1000);
		}
	}, [mode]);
	useEffect(() => {
		if (color) {
			const result = hexToRGB(color);
			result && setRGBColor(result);
		}
	}, [color]);
	const onPressCloseBtn = useCallback(() => {
		setInModalVisible && setInModalVisible(false);
		dispatch(setTimeModalMode(false));
		setMode('initial');
	}, []);

	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={inModalVisible}
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
					{mode === 'initial' && (
						<>
							{findIndividual && findIndividual[0] && (
								<>
									<View style={styles.blankView} />
									<Text style={styles.titleText}>모임명</Text>
									<View style={styles.blankView} />

									<View
										style={[
											styles.backgroundView,
											{
												backgroundColor: findIndividual[0].color
													? findIndividual[0].color
													: Colors.grey600,
											},
										]}
									>
										<View style={styles.columnView}>
											<View style={styles.rowView}>
												<Text
													style={
														(styles.touchText,
														{ color: Colors.white, fontSize: 16 })
													}
												>
													{findIndividual[0].name}
												</Text>
											</View>
										</View>
									</View>
								</>
							)}
							{findIndividual && findIndividual[0] && (
								<>
									<View style={styles.blankView} />
									<Text style={styles.titleText}>선택 시간</Text>
									<View style={styles.blankView} />

									<View style={[styles.backgroundView]}>
										<View style={styles.columnView}>
											<View style={styles.rowView}>
												<Text style={styles.touchText}>
													{findIndividual[0].selectTime > 12
														? `오후  ${findIndividual[0].selectTime - 12}시`
														: `오전  ${findIndividual[0].selectTime}시`}
												</Text>
											</View>
										</View>
									</View>
								</>
							)}

							<View style={styles.blankView} />
							<Text style={styles.titleText}>모임 시간</Text>
							<View style={styles.blankView} />
							{findIndividual.map((t) => (
								<View key={t.startTime.hour} style={[styles.backgroundView]}>
									<View style={styles.columnView}>
										<View style={styles.rowView}>
											<Text style={styles.touchText}>
												{t.startTime.hour > 12
													? `오후  ${t.startTime.hour - 12}`
													: `오전  ${t.startTime.hour}`}
												{'  : '}
												{t.startTime.minute < 10
													? '0' + t.startTime.minute
													: t.startTime.minute}
												{'  ~   '}
											</Text>

											<Text style={styles.touchText}>
												{t.endTime.hour >= 12
													? `오후  ${t.endTime.hour - 12}`
													: `오전  ${t.endTime.hour}`}
												{' : '}
												{t.endTime.minute < 10
													? '0' + t.endTime.minute
													: t.endTime.minute}
											</Text>
										</View>
									</View>
								</View>
							))}
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
		width: screen.width * 0.53,
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'flex-start',
	},
	columnView: {
		flexDirection: 'column',

		borderRadius: 13,

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
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
		width: screen.width * 0.9,
	},
	touchText: {
		fontSize: 15,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		justifyContent: 'center',
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
		justifyContent: 'center',
	},
	buttonOverLine: {
		borderWidth: 0.4,
		width: screen.width * 0.9,
		marginTop: 20,
		borderColor: Colors.black,
	},
	rowLine: {
		borderWidth: 0.4,
		width: '110%',
		marginTop: 15,
	},
});
