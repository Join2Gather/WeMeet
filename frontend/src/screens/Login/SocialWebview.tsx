import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { kakaoLogin } from '../../store/individual';
import { setAppleToken, getUserMe } from '../../store/login';
import type { kakaoLoginAPI } from '../../interface';

export function SocialWebview({ closeSocialModal, source }: any) {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const INJECTED_JAVASCRIPT =
		'(function() {if(window.document.getElementsByTagName("pre").length>0){window.document.getElementsByTagName("pre")[0].style.display = "none";window.ReactNativeWebView.postMessage((window.document.getElementsByTagName("pre")[0].innerHTML));}})();';
	let data: kakaoLoginAPI;

	useEffect(() => {
		return () => {
			data && dispatch(kakaoLogin(data.kakaoDates));
		};
	}, []);
	const _handleMessage = async (event: any) => {
		closeSocialModal();

		let result = JSON.parse(event.nativeEvent.data);
		let date = result.profiles[0].dates.filter((day: any) => day.club === null);
		date = date[0];
		data = {
			token: result.access_token,
			name: result.profiles[0].name,
			user: result.profiles[0].user,
			id: result.profiles[0].id,
			clubs: result.profiles[0].clubs,
			kakaoDates: date,
			dates: result.profiles[0].dates
		};
		console.log('token', data.token);
		try {
			dispatch(setAppleToken(data.token));
			dispatch(getUserMe({ token: data.token }));
		} catch (e) {
			console.log('Error', e);
		}

		navigation.navigate('TabNavigator');
	};

	return (
		<WebView
			originWhitelist={['*']}
			injectedJavaScript={INJECTED_JAVASCRIPT}
			source={source}
			javaScriptEnabled={true}
			onMessage={_handleMessage}
		/>
	);
}
