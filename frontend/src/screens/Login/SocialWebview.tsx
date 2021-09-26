import { useNavigation } from '@react-navigation/native';
import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { getSocialLogin } from '../../store/login';

// import { useAsyncStorage } from '@react-native-community/async-storage';
// const { setItem } = useAsyncStorage('토큰 key 값');

export function SocialWebview({ closeSocialModal, source }: any) {
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const INJECTED_JAVASCRIPT =
		'(function() {if(window.document.getElementsByTagName("pre").length>0){window.ReactNativeWebView.postMessage((window.document.getElementsByTagName("pre")[0].innerHTML));}})();';

	const _handleMessage = async (event: any) => {
		let result = JSON.parse(event.nativeEvent.data);
		console.log(typeof result);

		const data = {
			token: result.access_token,
			name: result.profiles[0].name,
			user: result.profiles[0].user,
			id: result.profiles[0].id,
			clubs: result.profiles[0].clubs,
			dates: result.profiles[0].dates,
		};
		// let userToken = result.Authorization;
		console.log(data);

		try {
			dispatch(getSocialLogin(data));
		} catch (e) {
			console.log(e);
		}

		closeSocialModal();
		navigation.navigate('TabNavigator');
	};

	return (
		<WebView
			//ref={this._refWebView}
			originWhitelist={['*']}
			injectedJavaScript={INJECTED_JAVASCRIPT}
			source={source}
			javaScriptEnabled={true}
			onMessage={_handleMessage}
		/>
	);
}
