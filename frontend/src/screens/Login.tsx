import React, { useState, useCallback, useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SocialWebviewModal } from './Login/SocialWebviewModal';
import { LinearGradient } from 'expo-linear-gradient';
// prettier-ignore
import {
  SafeAreaView,
  Text,
  UnderlineText,
  TextInput,
  TouchableView,
  TopBar,
  MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import { useAutoFocus, AutoFocusProvider } from '../contexts';
import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { clientBaseURL } from '../lib/api/client';
export default function Login() {
	const { name } = useSelector(({ login }: RootState) => ({
		name: login.name,
	}));
	const [person, setPerson] = useState('hi');
	const [socialModalVisible, setSocialModalVisible] = useState(false);
	const [source, setSource] = useState('');
	const focus = useAutoFocus();
	const navigation = useNavigation();
	// const goHomeNavigator = useCallback(
	//   () => navigation.navigate('HomeNavigator'),
	//   []
	// )
	// prettier-ignore
	const goTabNavigator = useCallback(() => navigation.navigate('TabNavigator'), []);
	useEffect(() => {
		if (name.length) {
			console.log('hihi');
			navigation.navigate('TabNavigator');
		} else {
			console.log('없음');
		}
	}, [name]);
	const onPressSocial = useCallback(async (social: any) => {
		setSocialModalVisible(true);
		setSource(`${clientBaseURL}accounts/kakao/login`);
		//setSource(`http://localhost:8000/accounts/kakao/login`);
	}, []);
	const onCloseSocial = useCallback(async () => {
		setSocialModalVisible(false);
	}, []);

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
						{source === '' && (
							<>
								<View style={[styles.textView]}>
									<Text style={styles.text}>WE MEET</Text>
								</View>
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
								<Text style={styles.buttonUnderText}>
									카카오 계정으로 간편로그인 하세요.
								</Text>
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
							</>
						)}
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
	textView: { width: '100%', padding: 5, marginBottom: 30 },
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
