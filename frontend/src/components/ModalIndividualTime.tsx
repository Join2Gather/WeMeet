import React, { useCallback, useState, useEffect } from 'react';
import {
	Alert,
	Modal,
	StyleSheet,
	Text,
	TouchableHighlight,
	View,
	Dimensions,
	ScrollView,
} from 'react-native';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { findTime } from '../interface/timetable';
import {
	makeTeamTime,
	setTeamName,
	setTimeModalMode,
	toggleIsInitial,
} from '../store/timetable';
import { Button } from '../lib/util/Button';
import { deleteHomeTime, initialTimeMode } from '../store/individual';
import { RootState } from '../store';
import { Spinner } from '.';
import { findTeam } from '../store/login';
import { useNavigation } from '@react-navigation/native';
import { CloseButton } from '../theme';
const screen = Dimensions.get('screen');

interface props {
	inModalVisible?: boolean;
	setInModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;

	findIndividual: findTime[];
	inTimeMode: string;
}

export function ModalIndividualTime({
	inModalVisible,
	setInModalVisible,

	findIndividual,
	inTimeMode,
}: props) {
	const {
		user,
		id,
		token,
		loginName,
		loginURI,
		color,
		peopleCount,
		startHour,
		endHour,
	} = useSelector(({ login }: RootState) => ({
		user: login.user,
		id: login.id,
		token: login.token,
		loginURI: login.uri,
		loginName: login.name,
		color: login.color,
		peopleCount: login.peopleCount,
		startHour: login.startHour,
		endHour: login.endHour,
	}));
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const [mode, setMode] = useState('normal');
	const [teamId, setId] = useState('');

	useEffect(() => {
		if (findIndividual && findIndividual[0]?.id && inModalVisible) {
			const id = String(findIndividual[0].id);
			dispatch(findTeam({ id: id }));
		}
	}, [findIndividual, teamId, inModalVisible]);

	const onPressCloseBtn = useCallback(() => {
		setInModalVisible && setInModalVisible(false);
		dispatch(setTimeModalMode(false));
		dispatch(initialTimeMode());
	}, []);
	const onPressDeleteBtn = useCallback(() => {
		dispatch(deleteHomeTime(findIndividual));
		dispatch(initialTimeMode());
		setMode('loading');
		setTimeout(() => {
			setMode('normal');
			setInModalVisible && setInModalVisible(false);
		}, 1000);
	}, [findIndividual]);
	const onPressMove = useCallback(() => {
		console.log(teamId);

		dispatch(toggleIsInitial(true));
		setTimeout(() => {
			dispatch(
				makeTeamTime({
					color,
					peopleCount,
					startHour,
					endHour,
				})
			);
			dispatch(setTeamName({ name: loginName, uri: loginURI }));
		}, 100);
		setTimeout(() => {
			navigation.navigate('HomeNavigator');
		}, 200);
		setTimeout(() => {
			navigation.navigate('TeamTime', {
				user,
				id,
				token,
				modalMode: 'normal',
			});
		}, 300);
		setInModalVisible && setInModalVisible(false);
		dispatch(initialTimeMode());
	}, [teamId, findIndividual, color, loginName, loginURI]);
	return (
		<Modal
			animationType="fade"
			transparent={true}
			visible={inModalVisible}
			onRequestClose={() => {
				Alert.alert('Modal has been closed.');
			}}
		>
			{/* <Spinner loading={mode} /> */}
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<CloseButton closeBtn={onPressCloseBtn} />

					<ScrollView>
						{findIndividual && findIndividual[0] && (
							<>
								<View style={styles.blankView} />
								<Text style={[styles.titleText]}>모임명</Text>
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
													{ color: Colors.white, fontSize: 15 })
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
						{findIndividual &&
							findIndividual.map((t) => (
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
						<View style={styles.blankView} />
					</ScrollView>
					{inTimeMode.includes('team') && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowLine} />
							<Button
								buttonNumber={2}
								buttonText="취소"
								secondButtonText="이동"
								onPressFunction={onPressCloseBtn}
								secondOnPressFunction={onPressMove}
							/>
						</>
					)}
					{inTimeMode.includes('everyTime') && (
						<>
							<View style={styles.blankView} />
							<View style={styles.rowLine} />
							<Button
								buttonNumber={2}
								buttonText="취소"
								secondButtonText="삭제"
								onPressFunction={onPressCloseBtn}
								secondOnPressFunction={onPressDeleteBtn}
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
		width: screen.width * 0.53,
		alignItems: 'center',
		alignSelf: 'center',
		justifyContent: 'flex-start',
	},
	columnView: {
		flexDirection: 'column',

		borderRadius: 13,

		margin: 20,
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
		maxHeight: screen.height * 0.7,
	},
	touchText: {
		fontSize: 14,
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
		marginLeft: '1%',
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
		borderTopWidth: 0.4,
		width: '113%',
		marginTop: 15,
	},
});
