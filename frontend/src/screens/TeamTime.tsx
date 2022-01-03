/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, 
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
	DayOfWeek,
	ModalConfirm,
	ModalDatePicker,
	Spinner,
} from '../components';
import { Timetable } from '../components/Timetable';
import { Colors } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import {
	makeInitialTimetable,
	setIsInTeamTime,
	toggleIsInitial,
} from '../store/timetable';
import { RootState } from '../store';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
type TeamStackParamList = {
	TeamTime: {
		user: number;
		id: number;
		token: string;
		modalMode: string;
	};
};

type Props = NativeStackScreenProps<TeamStackParamList, 'TeamTime'>;
import { setModalMode, shareUri } from '../store/team';
import { ModalSetting } from '../components/ModalSetting';
import { Sequence } from '../components/Sequence';
import { TouchableHighlight } from 'react-native-gesture-handler';

export default function TeamTime({ route }: Props) {
	const {
		uri,
		color,
		postDatesPrepare,
		confirmDatesPrepare,
		loadingChangeColor,
		joinName,
		joinUri,
		loadingJoin,
		joinTeamError,
		error,
		makeReady,
		createdDate,
		snapShotError,
		name,
		isConfirmProve,
		alarmTime,
		isOverlap,
	} = useSelector(({ timetable, login, loading, team }: RootState) => ({
		uri: timetable.teamURI,
		color: timetable.color,
		peopleCount: login.peopleCount,
		postDatesPrepare: timetable.postDatesPrepare,
		confirmDatesPrepare: timetable.confirmDatesPrepare,
		loadingIndividual: loading['timetable/GET_INDIVIDUAL'],
		loadingGroup: loading['timetable/GET_GROUP'],
		loadingJoin: loading['team/JOIN_TEAM'],
		loadingChangeColor: loading['team/CHANGE_COLOR'],
		joinName: team.joinName,
		joinUri: team.joinUri,
		joinTeamError: team.joinTeamError,
		error: team.error,
		makeReady: timetable.makeReady,
		createdDate: timetable.createdDate,
		snapShotError: timetable.snapShotError,
		name: timetable.teamName,
		isConfirmProve: login.isConfirmProve,
		alarmTime: login.alarmTime,
		isOverlap: timetable.isOverlap,
	}));
	// navigation
	const { id, user, token, modalMode } = route.params;
	const navigation = useNavigation();
	const dispatch = useDispatch();

	// 그룹인지 아닌지
	const [isGroup, setGroupMode] = useState(true);

	//modal
	const [modalVisible, setModalVisible] = useState(false);
	const [settingModalVisible, setSettingModalVisible] = useState(false);
	const [confirmModalVisible, setConfirm] = useState(false);
	const [mode, setMode] = useState('normal');
	const [settingMode, setSetting] = useState('initial');
	const [subMode, setSubMode] = useState('initial');
	const [isTimeMode, setIsTimeMode] = useState(false);
	const [currentNumber, setCurrent] = useState(0);
	const [sequence, setSequence] = useState([0, 1, 2]);
	const [dateVisible, setDateVisible] = useState(false);
	// initial
	useEffect(() => {
		makeReady && dispatch(makeInitialTimetable());
	}, [name, makeReady]);

	useEffect(() => {
		if (joinTeamError || error !== '') {
			navigation.navigate('TeamList');
		}
	}, [joinTeamError, loadingJoin, error]);

	useEffect(() => {
		isOverlap &&
			Alert.alert(
				'경고',
				`개인 일정과 겹치는 시간이 존재 합니다.\n 개인 시간표에서 수정해 주세요`,
				[{ text: '확인', onPress: () => {} }]
			);
	}, [isOverlap]);

	// useCallback
	const goConfirmPage = useCallback(() => {
		setConfirm(true);
	}, []);
	const goLeft = useCallback(() => {
		navigation.goBack();
		dispatch(setModalMode('normal'));
		dispatch(setIsInTeamTime(false));
		dispatch(toggleIsInitial(false));
	}, []);
	// 공유하기 버튼
	const onShareURI = useCallback(() => {
		if (modalMode === 'join')
			dispatch(shareUri({ id, token, user, uri: joinUri }));
		else dispatch(shareUri({ id, token, user, uri }));
	}, [id, user, token, uri, joinUri]);
	const onPressPlusBtn = useCallback(() => {
		setIsTimeMode(true);
		setMode('startMode');
	}, []);

	const onPressGrInBtn = useCallback((groupMode) => {
		setGroupMode(groupMode);
	}, []);
	return (
		<>
			<SafeAreaView style={{ backgroundColor: color }}>
				<View style={[styles.view]}>
					<NavigationHeader
						headerColor={color}
						title={modalMode === 'join' ? joinName : name}
						titleStyle={{ paddingLeft: 0 }}
						Left={() => (
							<TouchableHighlight underlayColor={color} onPress={goLeft}>
								<Icon
									name="angle-left"
									size={22}
									color={Colors.white}
									// style={{ marginLeft: '3%' }}
								/>
							</TouchableHighlight>
						)}
						Right={() =>
							isGroup ? (
								<TouchableHighlight
									underlayColor={color}
									onPress={goConfirmPage}
								>
									<MIcon
										name="check-bold"
										size={20}
										color={Colors.white}
										style={{ paddingTop: 1 }}
									/>
								</TouchableHighlight>
							) : (
								<TouchableHighlight
									underlayColor={color}
									onPress={onPressPlusBtn}
								>
									<FontAwesome5Icon
										name="plus"
										size={22}
										color={Colors.white}
										style={{ paddingTop: 1 }}
									/>
								</TouchableHighlight>
							)
						}
						secondRight={() => (
							<TouchableHighlight
								underlayColor={color}
								onPress={() => setSettingModalVisible(true)}
							>
								<MaterialIcon
									name="settings"
									size={24}
									color={Colors.white}
									style={{ paddingTop: 1 }}
								/>
							</TouchableHighlight>
						)}
					/>

					<View style={styles.viewHeight}>
						<View style={styles.rowButtonView}>
							{/* <Spinner loading={loadingIndividual} /> */}
							{mode === 'normal' && (
								<View style={styles.boxOverView}>
									<>
										<View
											style={{
												flexDirection: 'row',
												justifyContent: 'center',
												// marginTop: 25,
												height: 25,
											}}
										>
											<TouchableOpacity
												style={styles.touchableBoxView}
												onPress={() => onPressGrInBtn(true)}
											>
												<MIcon
													name={
														isGroup
															? 'checkbox-marked-outline'
															: 'checkbox-blank-outline'
													}
													size={24}
													color={color !== '' ? color : Colors.blue500}
												/>
												<Text style={styles.iconText}>그룹</Text>
											</TouchableOpacity>
											<TouchableOpacity
												style={[styles.touchableBoxView, { marginLeft: 70 }]}
												onPress={() => onPressGrInBtn(false)}
											>
												<MIcon
													name={
														isGroup
															? 'checkbox-blank-outline'
															: 'checkbox-marked-outline'
													}
													size={23}
													color={color !== '' ? color : Colors.blue500}
												/>
												<Text style={styles.iconText}>개인</Text>
											</TouchableOpacity>
										</View>
									</>
									<View style={styles.rowView}>
										<View
											style={[styles.boxView, { backgroundColor: color }]}
										/>
										<Text style={styles.infoText}>가능 일정</Text>
										{isOverlap && (
											<>
												<View
													style={[
														styles.boxView,
														{ backgroundColor: Colors.grey600 },
													]}
												/>
												<Text style={styles.infoText}>겹쳐진 일정</Text>
											</>
										)}
										<View
											style={[
												styles.boxView,
												{ backgroundColor: Colors.grey300 },
											]}
										/>
										<Text style={styles.infoText}>개인 일정</Text>
										<View
											style={[
												styles.boxView,
												{ backgroundColor: Colors.white },
											]}
										/>
										<Text style={styles.infoText}>비어있는 일정</Text>
									</View>
								</View>
							)}
							{isTimeMode && (
								<View style={{ flexDirection: 'column' }}>
									<View style={{ height: 30 }} />
									<Sequence
										color={color}
										currentNumber={currentNumber}
										mode={sequence}
									/>
									{mode === 'startMode' && (
										<>
											<Text style={styles.stepText}>
												일정 시작 시간을 터치해주세요
											</Text>
										</>
									)}

									{mode === 'startMinute' && (
										<>
											<Text style={styles.stepText}>일정 시작 분 설정</Text>
										</>
									)}
									{mode === 'endMode' && (
										<>
											<Text style={styles.stepText}>
												종료 시간 입력해주세요
											</Text>
										</>
									)}
								</View>
							)}
						</View>
					</View>
					<DayOfWeek isTeam={true} />
					<ScrollView style={{ backgroundColor: Colors.white }}>
						<Timetable
							mode={mode}
							setMode={setMode}
							modalVisible={modalVisible}
							setModalVisible={setModalVisible}
							setIsTimeMode={setIsTimeMode}
							isGroup={isGroup}
							uri={uri}
							postDatesPrepare={postDatesPrepare}
							confirmDatesPrepare={confirmDatesPrepare}
							color={color}
							setCurrent={setCurrent}
							isHomeTime={false}
						/>
						<ModalSetting
							settingModalVisible={settingModalVisible}
							setSettingModalVisible={setSettingModalVisible}
							id={id}
							token={token}
							user={user}
							color={color}
							uri={uri}
							loadingChangeColor={loadingChangeColor}
							createdDate={createdDate}
							name={name}
							onShareURI={onShareURI}
							snapShotError={snapShotError}
							isConfirmProve={isConfirmProve}
							dateVisible={dateVisible}
							setDateVisible={setDateVisible}
							alarmTime={alarmTime}
							setSetting={setSetting}
							settingMode={settingMode}
							subMode={subMode}
							setSubMode={setSubMode}
						/>
						<ModalDatePicker
							dateVisible={dateVisible}
							setDateVisible={setDateVisible}
							setSettingModalVisible={setSettingModalVisible}
							name={name}
							alarmTime={alarmTime}
							setSetting={setSetting}
							setSubMode={setSubMode}
						/>

						<ModalConfirm
							color={color}
							confirmModalVisible={confirmModalVisible}
							name={name}
							setConfirm={setConfirm}
							uri={uri}
							isOverlap={isOverlap}
						/>
					</ScrollView>
				</View>
			</SafeAreaView>
		</>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowButtonView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignSelf: 'center',
	},
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		marginTop: 25,
	},
	viewHeight: {
		height: 115,
	},
	touchableBoxView: {
		flexDirection: 'row',
		alignItems: 'center',
		// marginBottom: 25,
		justifyContent: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		// height: 20,
	},
	modeDescriptionText: {
		flexDirection: 'row',
		alignSelf: 'center',
	},
	iconText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		textAlign: 'center',
		letterSpacing: -1,
		marginTop: 2,
		marginLeft: 1,
		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		textAlign: 'center',
		letterSpacing: -1,

		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	boxButtonView: {
		width: 15,
		height: 15,
		borderWidth: 0.3,
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.5,
		// marginTop: 1,
		alignSelf: 'center',
	},
	titleText: {
		fontSize: 17,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 12,
		letterSpacing: -1,
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
		height: 40,
		marginTop: 20,
		textAlign: 'center',
	},
	loadingText: {
		fontFamily: 'NanumSquareR',
		fontSize: 20,
		color: Colors.white,
	},
	boxOverView: {
		flexDirection: 'column',
		marginTop: 25,
	},
});
