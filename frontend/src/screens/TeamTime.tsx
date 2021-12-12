/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, 
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntIcon from 'react-native-vector-icons/MaterialIcons';
import { Spinner } from '../components';
import { Timetable } from '../components/Timetable';
import { Colors } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import {
	makeInitialTimetable,
	makeTeamTime,
	setIsInTeamTime,
	setTeamName,
} from '../store/timetable';
import { RootState } from '../store';
import { findTeam } from '../store/login';
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

export default function TeamTime({ route }: Props) {
	const {
		uri,
		color,
		peopleCount,
		postDatesPrepare,
		confirmDatesPrepare,
		loadingIndividual,
		loadingGroup,
		loadingChangeColor,
		joinName,
		joinUri,
		loadingJoin,
		joinTeamError,
		error,
		startHour,
		endHour,
		makeReady,
		createdDate,
		snapShotError,
		name,
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
		startHour: login.startHour,
		endHour: login.endHour,
		makeReady: timetable.makeReady,
		createdDate: timetable.createdDate,
		snapShotError: timetable.snapShotError,
		name: timetable.teamName,
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
	const [mode, setMode] = useState('normal');
	const [isTimeMode, setIsTimeMode] = useState(false);
	const [currentNumber, setCurrent] = useState(0);
	const [sequence, setSequence] = useState([0, 1, 2]);
	// useEffect
	// useEffect(() => {
	// 	modalMode !== 'make' &&
	// 		dispatch(makeTeamTime({ color, peopleCount, startHour, endHour }));
	// }, [color, peopleCount, startHour, endHour, modalMode]);
	// initial
	useEffect(() => {
		makeReady && dispatch(makeInitialTimetable());
	}, [name, makeReady]);
	// useEffect(() => {
	// 	if (modalMode === 'join') dispatch(setTeamName(joinName));
	// 	else dispatch(setTeamName(name));
	// }, [name, joinName]);
	// URI 찾아오기 로직
	// useEffect(() => {
	// 	if (modalMode === 'normal') dispatch(findURI(name));
	// 	else if (modalMode === 'make') dispatch(findURI(name));
	// 	else dispatch(putURI(joinUri));
	// }, [name, modalMode, joinUri]);
	// 에러 있으면 목록 페이지로 이동
	useEffect(() => {
		if (joinTeamError || error !== '') {
			navigation.navigate('TeamList');
		}
	}, [joinTeamError, loadingJoin, error]);

	// useCallback
	const goConfirmPage = useCallback(() => {
		Alert.alert('', '모임 시간을 정하셨나요?', [
			{ text: '취소', onPress: () => {} },
			{
				text: '확인',
				onPress: () => {
					navigation.navigate('SnapShot', {
						name,
						color,
						timetableMode: 'confirm',
						isConfirm: true,
						uri,
					});
				},
			},
		]);
	}, [name, color]);
	const goLeft = useCallback(() => {
		navigation.goBack();
		dispatch(setModalMode('normal'));
		dispatch(setIsInTeamTime(false));
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
	return (
		<>
			<SafeAreaView style={{ backgroundColor: color }}>
				<View style={[styles.view]}>
					<NavigationHeader
						headerColor={color}
						title={modalMode === 'join' ? joinName : name}
						titleStyle={{ paddingLeft: 0 }}
						Left={() => (
							<Icon
								name="angle-left"
								size={24}
								onPress={goLeft}
								color={Colors.white}
								// style={{ marginLeft: '3%' }}
							/>
						)}
						Right={() =>
							isGroup ? (
								<MIcon
									name="check-bold"
									size={22}
									color={Colors.white}
									style={{ paddingTop: 1 }}
									onPress={goConfirmPage}
								/>
							) : (
								<FontAwesome5Icon
									name="plus"
									size={25}
									color={Colors.white}
									style={{ paddingTop: 1 }}
									onPress={onPressPlusBtn}
								/>
							)
						}
						secondRight={() => (
							<MaterialIcon
								name="settings"
								size={27}
								color={Colors.white}
								style={{ paddingTop: 1 }}
								onPress={() => setSettingModalVisible(true)}
							/>
						)}
					/>

					<View style={styles.viewHeight}>
						<View style={styles.rowButtonView}>
							{/* <Spinner loading={loadingIndividual} /> */}
							{mode === 'normal' && (
								<View style={styles.boxOverView}>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-evenly',
										}}
									>
										<TouchableOpacity
											style={styles.touchableBoxView}
											onPress={() => setGroupMode(true)}
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
											onPress={() => setGroupMode(false)}
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
									<View style={{ flexDirection: 'row' }}>
										<View
											style={[styles.boxView, { backgroundColor: color }]}
										/>
										<Text style={styles.infoText}>가능 일정</Text>
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
	viewHeight: {
		height: 90,
	},
	touchableBoxView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
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
		fontFamily: 'NanumSquareR',
		fontSize: 15,
		textAlign: 'center',
		letterSpacing: -1,
		marginTop: 2,
		marginLeft: 1,
		alignSelf: 'center',
		justifyContent: 'center',
		textAlignVertical: 'center',
	},
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
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
		borderWidth: 0.3,
		marginTop: 1,
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
		marginTop: 20,
	},
});
