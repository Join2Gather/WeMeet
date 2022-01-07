import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	Dimensions,
	Animated,
	PanResponder,
	Platform,
	GestureResponderEvent,
	PanResponderGestureState,
	Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
	SafeAreaView,
	TouchableView,
	TopBar,
	MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import Icons from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { initialError, setModalMode } from '../store/team';
import { ModalInput, Spinner } from '../components';
import { NavigationHeader } from '../theme';
import { findTeam, getUserMe } from '../store/login';
import { Colors } from 'react-native-paper';
import {
	makeInitialOverlap,
	makeTeamTime,
	setIsInTeamTime,
	setTeamName,
	toggleIsInitial,
} from '../store/timetable';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { hexToRGB } from '../lib/util/hexToRGB';
import { TouchableHighlight } from 'react-native';
import { TouchHeaderIconView } from '../theme';
import {
	useAnimatedValue,
	useAnimatedValueXY,
	useNavigationHorizontalInterpolator,
	usePanResponder,
} from '../hooks';
import { transform } from 'lodash';
import { initialTimeMode } from '../store/individual';
import { interpolate } from '../lib/util/interpolate';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';

type Event = GestureResponderEvent;
type State = PanResponderGestureState;

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
const circleWidth = 14;

const iconSize = 22;

interface goTeam {
	id?: string;
	name?: string;
	uri?: string;
}

export default function TeamList() {
	const {
		user,
		id,
		clubs,
		token,
		loginURI,
		loginName,
		joinTeam,
		joinName,
		postTeamError,
		joinTeamError,
		loadingJoin,
		loadingChangeColor,
		teamColor,
		teamName,
		teamUri,
		teamMakeColor,
		joinUri,
		loadingUserMe,
		makeReady,
		modalMode,
		color,
		peopleCount,
		startHour,
		endHour,
		makeStartHour,
		makeEndHour,
		individualColor,
	} = useSelector(({ login, team, loading, timetable }: RootState) => ({
		user: login.user,
		id: login.id,
		clubs: login.clubs,
		token: login.token,
		loginURI: login.uri,
		loginName: login.name,
		joinTeam: team.joinTeam,
		joinName: team.joinName,
		joinTeamError: team.joinTeamError,
		postTeamError: team.postTeamError,
		loadingJoin: loading['team/JOIN_TEAM'],
		loadingChangeColor: loading['team/CHANGE_COLOR'],
		teamColor: timetable.color,
		teamMakeColor: team.teamColor,
		teamName: team.name,
		teamUri: team.joinUri,
		joinUri: team.joinUri,
		loadingUserMe: loading['login/USER_ME'],
		makeReady: timetable.makeReady,
		modalMode: team.modalMode,
		color: login.color,
		peopleCount: login.peopleCount,
		startHour: login.startHour,
		endHour: login.endHour,
		makeStartHour: team.startHour,
		makeEndHour: team.endHour,
		individualColor: login.individualColor,
	}));

	const [sequence, setSequence] = useState([0, 1, 2, 3]);
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('initial');
	const [makeName, setMake] = useState('');
	const navigation = useNavigation();
	const [buttonShown, setButtonShown] = useState(true);
	const [scrollEnabled, setScrollEnabled] = useScrollEnabled();
	const animValueXY = useAnimatedValueXY();
	const [RGBColor, setRGBColor] = useState({
		r: 0,
		g: 0,
		b: 0,
	});

	// const ios = Platform.OS === 'ios';

	// const scrolling = useAnimatedValue(0);

	// const panResponser = usePanResponder({
	// 	onPanResponderGrant() {
	// 		ios && setScrollEnabled(false);
	// 	},
	// 	onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
	// 		return gestureState.dx != 0 && gestureState.dy != 0;
	// 	},
	// 	onPanResponderMove(e: Event, s: State) {
	// 		const { dx, dy } = s;
	// 		animValueXY.setValue({ x: dx, y: dy });
	// 		if (dy > 5) {
	// 			Animated.timing(scrolling, {
	// 				useNativeDriver: true, // -1-
	// 				toValue: 0, // -2-
	// 				duration: 500, // -3-
	// 				easing: Easing.ease, // -4-
	// 			}).start();
	// 		} else if (dy < -5) {
	// 			Animated.timing(scrolling, {
	// 				useNativeDriver: true, // -1-
	// 				toValue: 100, // -2-
	// 				duration: 500, // -3-
	// 				easing: Easing.ease, // -4-
	// 			}).start();
	// 		}
	// 	},
	// 	onPanResponderRelease() {
	// 		animValueXY.extractOffset();
	// 		ios && setScrollEnabled(true);
	// 	},
	// });

	const [loading, setLoading] = useState('');

	// const animValue = useAnimatedValue(0);
	// const AnimatedTouchable =
	// 	Animated.createAnimatedComponent(TouchableHighlight);
	const dispatch = useDispatch();

	// useEffect
	useEffect(() => {
		dispatch(getUserMe({ token }));
	}, [joinTeam]);
	useEffect(() => {
		const result = hexToRGB(individualColor);
		result && setRGBColor(result);
	}, [individualColor]);
	useEffect(() => {
		if (mode === 'next') {
			if (modalMode === 'make') {
				dispatch(
					makeTeamTime({
						color: teamMakeColor,
						peopleCount: 1,
						startHour: makeStartHour,
						endHour: makeEndHour,
					})
				);
				dispatch(setTeamName({ name: makeName, uri: teamUri }));

				setTimeout(() => {
					navigation.navigate('TeamTime', {
						user,
						id,
						token,
						modalMode,
					});
				}, 50);
				setMode('normal');
			} else if (modalMode === 'join') {
				dispatch(
					makeTeamTime({
						color: teamMakeColor,
						peopleCount,
						startHour,
						endHour,
					})
				);
				dispatch(setTeamName({ name: loginName, uri: loginURI }));
			} else {
				dispatch(
					makeTeamTime({
						color,
						peopleCount,
						startHour,
						endHour,
					})
				);
				dispatch(setTeamName({ name: loginName, uri: loginURI }));
			}

			setTimeout(() => {
				navigation.navigate('TeamTime', {
					user,
					id,
					token,
					modalMode,
				});
			}, 50);
			setMode('normal');
			dispatch(toggleIsInitial(true));
			dispatch(setIsInTeamTime(true));
		}
	}, [
		modalMode,
		mode,
		teamMakeColor,
		makeStartHour,
		makeEndHour,
		makeName,
		loginURI,
		loginName,
	]);
	const goTeamTime = useCallback(
		({ id, name, uri }: goTeam) => {
			if (modalMode === 'join') {
				dispatch(findTeam({ uri }));
				setMode('next');
			} else if (modalMode === 'normal') {
				dispatch(findTeam({ id }));
				setMode('next');
			} else if (modalMode === 'make') {
				name && setMake(name);
				// dispatch(findTeam({ name }));
				setMode('next');
			}

			dispatch(initialError());
		},
		[modalMode]
	);
	// 모달 모드 분리
	const onMakeTeamTime = useCallback(() => {
		if (sequence.length !== 4) setSequence((sequence) => [...sequence, 3]);
		dispatch(setModalMode('make'));
		setModalVisible(true);
	}, [sequence]);
	const onJoinTeamTime = useCallback(() => {
		setSequence((sequence) => sequence.filter((idx) => idx !== 3));
		setMode('initial');
		dispatch(setModalMode('join'));

		setModalVisible(true);
	}, [sequence]);
	const onReload = useCallback(() => {
		dispatch(getUserMe({ token }));
		setLoading('loading');
		setTimeout(() => {
			setLoading('');
		}, 500);
	}, []);
	const onPressGoTeamTime = useCallback((item) => {
		dispatch(toggleIsInitial(true));
		dispatch(makeInitialOverlap());
		goTeamTime({ id: item.id });
	}, []);
	return (
		<SafeAreaView
			style={{ backgroundColor: modalVisible ? Colors.white : individualColor }}
		>
			<ScrollEnabledProvider>
				<View
					style={[
						styles.view,
						{ opacity: modalVisible ? 0.2 : 1, backgroundColor: Colors.white },
					]}
				>
					<NavigationHeader
						title="모임 목록"
						headerColor={individualColor}
						Left={() => (
							<TouchHeaderIconView
								underlayColor={individualColor}
								onPress={onReload}
							>
								<FontAwesome5Icon
									name="redo-alt"
									size={iconSize}
									color={Colors.white}
									style={{ paddingTop: 1 }}
								/>
							</TouchHeaderIconView>
						)}
						Right={() => (
							<TouchHeaderIconView
								underlayColor={individualColor}
								onPress={onMakeTeamTime}
							>
								<FontAwesome5Icon
									name="plus"
									size={iconSize}
									color={Colors.white}
									style={{ paddingTop: 1 }}
								/>
							</TouchHeaderIconView>
						)}
					/>
					{/* <Spinner loading={userLoading} /> */}
					{clubs.length !== 0 && (
						<Text style={[styles.headerUnderText]}>Plan list</Text>
					)}

					{!clubs.length && (
						<View
							style={{
								flexDirection: 'column',
								marginLeft: '16%',
								marginTop: 20,
								flex: 0.3,
							}}
						>
							<Text style={styles.noListText}>
								아직 아무런 모임이 없네요 😭
							</Text>
							<Text style={styles.noListText}>
								1. 상단의 "+" 버튼을 눌러 모임을 생성 하거나
							</Text>
							<Text style={styles.noListText}>
								2. 하단의 "모임 참여"를 눌러 모임에 참여해 보세요
							</Text>
						</View>
					)}
					<View style={{ flex: 2 }}>
						<FlatList
							style={[styles.FlatView]}
							data={clubs}
							scrollEnabled={scrollEnabled}
							renderItem={({ item }) => (
								<View
									style={{
										backgroundColor: Colors.black,
									}}
								>
									<TouchableHighlight
										onPress={() => onPressGoTeamTime(item)}
										activeOpacity={0.1}
										underlayColor={Colors.grey300}
										style={[styles.teamListTouchableView, {}]}
									>
										<View style={styles.teamView}>
											<View
												style={[
													styles.rowCircle,
													{ backgroundColor: item.color },
												]}
											/>
											<Text
												numberOfLines={1}
												ellipsizeMode="tail"
												style={styles.teamTitle}
											>
												{item.name}
											</Text>
											<Icons size={15} name="right" style={styles.iconStyle} />
										</View>
									</TouchableHighlight>
								</View>
							)}
							keyExtractor={(item, index) => String(item.id)}
						/>
					</View>
					<Spinner loading={loading} />
					<ModalInput
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						user={user}
						id={id}
						token={token}
						goTeamTime={goTeamTime}
						modalMode={modalMode}
						loadingJoin={loadingJoin}
						postTeamError={postTeamError}
						joinTeamError={joinTeamError}
						joinUri={joinUri}
						loadingChangeColor={loadingChangeColor}
						joinName={joinName}
						makeReady={makeReady}
						individualColor={individualColor}
						sequence={sequence}
					/>

					{/* <Animated.View
						style={{
							// position: 'absolute',

							transform: [{ translateY: scrolling }],
						}}
					>
						<TouchableView
							style={[
								styles.touchableView,
								{
									backgroundColor: individualColor,
								},
							]}
							onPress={onJoinTeamTime}
						>
							<Text style={styles.loginText}>모임 참여</Text>
						</TouchableView>
					</Animated.View> */}
				</View>
			</ScrollEnabledProvider>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	view: { justifyContent: 'center', backgroundColor: Colors.white, flex: 1 },
	headerUnderText: {
		fontFamily: 'NanumSquareR',
		fontSize: 16,
		marginTop: 15,
		marginBottom: 20,
		letterSpacing: -0.3,
		flex: 0.08,
		textAlign: 'center',
	},

	text: {
		fontSize: 60,
		textAlign: 'center',
		marginBottom: 120,
		letterSpacing: -3,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	buttonUnderText: {
		marginTop: 12,
		fontSize: 12,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	loginText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 20,
		marginLeft: 10,
		color: Colors.white,
	},
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rowCircle: {
		width: circleWidth,
		height: circleWidth,
		borderRadius: circleWidth / 2,
		// position: 'absolute',
		marginLeft: '11%',
		// top: -7,
	},
	teamTitle: {
		fontSize: 13,
		fontFamily: 'SCDream4',
		color: '#000',
		position: 'absolute',
		letterSpacing: -0.5,
		left: '21%',
		overflow: 'hidden',
		textAlign: 'center',
	},
	noListText: {
		fontSize: 13,
		fontFamily: 'SCDream4',
		letterSpacing: -0.5,
		overflow: 'hidden',
		textAlign: 'left',
		marginBottom: 30,
		// textAlign: 'center',
	},
	iconStyle: {
		position: 'absolute',
		right: '11%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
	},
	textView: { width: '100%', padding: 5, marginBottom: 30 },
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 50,
		marginBottom: 30,
		borderRadius: 10,
		// position: 'absolute',
		width: '65%',
		// left: '60%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: Colors.white,
		shadowOffset: {
			width: 1,
			height: 1,
		},

		shadowOpacity: 0.21,
		shadowRadius: 1.0,
	},
	teamListTouchableView: {
		flexDirection: 'row',

		// borderRadius: 10,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: 'white',
		shadowOffset: {
			width: 1,
			height: 1,
		},
		paddingTop: 13,
		paddingBottom: 13,
	},
	blurView: {
		paddingTop: 5,
		paddingBottom: 10,
		opacity: 0.5,
		// backgroundColor: Colors.grey200,
	},
	FlatView: {
		height: '100%',
		flexGrow: 0,
	},
	teamView: {
		justifyContent: 'flex-start',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
	},
});
