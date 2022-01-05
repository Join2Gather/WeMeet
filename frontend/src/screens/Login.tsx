import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Animated, Platform, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SocialWebviewModal } from './Login/SocialWebviewModal';
import { LinearGradient } from 'expo-linear-gradient';
import {
	SafeAreaView,
	TouchableView,
	MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import { useAutoFocus, AutoFocusProvider } from '../contexts';
import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { clientBaseURL } from '../lib/api/client';
import { AppleLogin } from '../components';
import { useAnimatedValues, useLayout, useToggle } from '../hooks';
import { interpolate } from '../lib/util';
import { TouchableOpacity } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { cloneHomeDate, setTodayDate } from '../store/individual';
import { getUserMe } from '../store/login';
dayjs.locale('ko');

export default function Login() {
	const { name, token, homeTime } = useSelector(({ login }: RootState) => ({
		name: login.name,
		token: login.token,
		homeTime: login.homeTime,
	}));

	const [socialModalVisible, setSocialModalVisible] = useState(false);
	const [source, setSource] = useState('');
	const focus = useAutoFocus();
	const navigation = useNavigation();
	const AnimatedText = Animated.createAnimatedComponent(Text);
	const [started, toggleStarted] = useToggle();

	const Title = useMemo(() => ['WE ', 'MEET'], []);
	const animValues = useAnimatedValues(Title.length);
	const [layout, setLayout] = useLayout();
	const startAnimations = useMemo(
		() =>
			Title.map((notUsed, index) =>
				Animated.spring(animValues[index], {
					useNativeDriver: true,
					toValue: 1,
				})
			),
		[]
	);
	const endAnimations = useMemo(
		() =>
			Title.map((notUsed, index) =>
				Animated.spring(animValues[index], {
					useNativeDriver: true,
					toValue: 0,
				})
			),
		[]
	);
	const appLoading = useCallback(() => {
		if (Platform.OS === 'ios')
			Animated.stagger(600, [...startAnimations]).start(toggleStarted);
		else Animated.sequence([...startAnimations]).start(toggleStarted);
	}, [started]);

	const icons = useMemo(
		() =>
			Title.map((t, index) => {
				const numberOfText = Title.length;
				const animValue = animValues[index];
				const transform = {
					transform: [
						{
							translateY: interpolate(animValue, [-400, 0]),
						},
						{ rotate: interpolate(animValue, ['0deg', '360deg']) },
					],
				};
				return (
					<AnimatedText key={index} style={[transform, styles.text]}>
						{t}
					</AnimatedText>
				);
			}),
		[layout.height]
	);

	// const goHomeNavigator = useCallback(
	//   () => navigation.navigate('HomeNavigator'),
	//   []
	// )
	// prettier-ignore

	console.log('token', token)
	const goTabNavigator = useCallback(
		() => navigation.navigate('TabNavigator'),
		[]
	);
	useEffect(() => {
		if (token) {
			dispatch(getUserMe({ token }));
			dispatch(cloneHomeDate({ start: homeTime.start, end: homeTime.end }));
			setTimeout(() => {
				navigation.navigate('TabNavigator');
			}, 1300);
		} else {
			console.log('없음');
		}
	}, [token, homeTime]);
	useEffect(() => {
		appLoading();
	}, []);

	const onPressSocial = useCallback(
		async (social: any) => {
			setSocialModalVisible(true);
			console.log(clientBaseURL);
			setSource(`${clientBaseURL}accounts/kakao/login`);
			//setSource(`http://localhost:8000/accounts/kakao/login`);
		},
		[clientBaseURL]
	);
	const onCloseSocial = useCallback(async () => {
		setSocialModalVisible(false);
	}, []);
	const [date, setDate] = useState(dayjs().format('d'));
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setTodayDate(Number(date)));
	}, [date]);

	return (
		<LinearGradient
			colors={['#33aafc', '#017bff']}
			style={{ flex: 1 }}
			end={{ x: 0.95, y: 0.95 }}
			start={{ x: 0.01, y: 0.01 }}
		>
			<SafeAreaView style={{ padding: 0, margin: 0 }}>
				<View style={[styles.view, { margin: 0, padding: 0 }]}>
					<AutoFocusProvider
						contentContainerStyle={[styles.keyboardAwareFocus]}
						contentInsetAdjustmentBehavior="never"
						style={{ margin: 0, padding: 0 }}
					>
						{source !== '' && (
							<SocialWebviewModal
								visible={socialModalVisible}
								source={source}
								closeSocialModal={onCloseSocial}
							/>
						)}
						<TouchableOpacity onPress={appLoading}>
							<View style={[styles.textView]}>
								{/* <Text style={styles.text}>WE MEET</Text> */}
								{icons}
							</View>
						</TouchableOpacity>

						{token === '' && (
							<>
								<TouchableView
									style={[
										styles.touchableView,
										{ backgroundColor: Colors.white },
									]}
									onPress={() => {
										onPressSocial('');
										//goTabNavigator();
									}}
								>
									<Text style={styles.loginText}>카카오 로그인</Text>
								</TouchableView>
								<View style={{ height: 15 }} />

								{Platform.OS === 'ios' && <AppleLogin />}
								<Text style={styles.buttonUnderText}>
									카카오 계정으로 간편로그인 하세요.
								</Text>
							</>
						)}
						<Text
							style={{
								position: 'absolute',
								bottom: 0,
								color: Colors.white,
								fontSize: 11,
								fontFamily: 'SCDream4',
							}}
						>
							make your plan
						</Text>
					</AutoFocusProvider>
				</View>
			</SafeAreaView>
		</LinearGradient>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
	text: {
		fontSize: 60,
		textAlign: 'center',
		marginBottom: 120,
		letterSpacing: -3,
		color: '#FFF',
		fontFamily: 'SCDream2',
	},
	buttonUnderText: {
		marginTop: 12,
		fontSize: 12,
		color: '#FFF',
		fontFamily: 'SCDream4',
	},
	loginText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 20,
		marginLeft: 10,
		color: Colors.blue700,
	},
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textView: {
		padding: 5,
		marginBottom: 30,
		flexDirection: 'row',
	},
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 45,
		borderRadius: 10,
		width: '65%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		shadowOffset: {
			width: 1,
			height: 1,
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0,
	},
});
