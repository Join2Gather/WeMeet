import React, { useState } from 'react';
import {
	Platform,
	StyleSheet,
	Keyboard,
	Alert,
	ActivityIndicator,
} from 'react-native';
import {
	SafeAreaView,
	View,
	Text,
	UnderlineText,
	TextInput,
	TouchableView,
	TopBar,
	MaterialCommunityIcon as Icon,
} from '../theme';
import { useNavigation } from '@react-navigation/native';
import { useAutoFocus, AutoFocusProvider } from '../contexts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useCallback } from 'react';
import { getLogin, initialLogin, setIdPw } from '../store/login';
import { useEffect } from 'react';
import type { User } from '../interface';
export default function MainNavigator() {
	// text
	const focus = useAutoFocus();
	const [id, setId] = useState<string>('');
	const [pw, setPW] = useState<string>('');
	const { token, loginError, loadingLogin } = useSelector(
		({ login, loading }: RootState) => ({
			token: login.token,
			loginError: login.loginError,
			loadingLogin: loading['login/GET_LOGIN'],
		})
	);
	const dispatch = useDispatch();
	const onSubmit = useCallback(() => {
		dispatch(getLogin({ id, pw }));
		dispatch(setIdPw({ id, pw }));
		setId((notUsed) => '');
		setPW((notUsed) => '');
		dispatch(initialLogin());
	}, [id, pw]);
	useEffect(() => {
		token && Alert.alert('로그인 성공');
		loginError && Alert.alert('로그인 실패!!!');
	}, [token, loginError]);
	const navigation = useNavigation();
	const goTabNavigator = useCallback(
		() => navigation.navigate('TabNavigator'),
		[]
	);
	return (
		<SafeAreaView>
			<View style={[styles.view]}>
				<AutoFocusProvider contentContainerStyle={[styles.keyboardAwareFocus]}>
					<View style={[styles.textView]}>
						<Text style={[styles.text]}>ID</Text>
						<View border style={[styles.textInputView]}>
							<TextInput
								onFocus={focus}
								style={[styles.textInput]}
								value={id}
								onChangeText={(id) => setId((text) => id)}
								placeholder="enter your ID"
							/>
						</View>
					</View>
					<View style={[styles.textView]}>
						<Text style={[styles.text]}>PW</Text>
						<View border style={[styles.textInputView]}>
							<TextInput
								onFocus={focus}
								style={[styles.textInput]}
								value={pw}
								onChangeText={(pw) => setPW((text) => pw)}
								placeholder="enter your PW"
							/>
						</View>
					</View>
					{loadingLogin && <ActivityIndicator size="large" />}
					<TouchableView
						notification
						style={[styles.touchableView]}
						onPress={goTabNavigator}
					>
						<Text style={[styles.text, { marginRight: 5 }]}>Login</Text>
						<Icon name="login" size={24} />
					</TouchableView>
				</AutoFocusProvider>
				<View style={[{ marginBottom: Platform.select({ ios: 50 }) }]} />
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1, justifyContent: 'space-between' },
	text: { fontSize: 20 },
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	textView: { width: '100%', padding: 5, marginBottom: 10 },
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
		flexDirection: 'row',
		height: 50,
		borderRadius: 10,
		width: '90%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
