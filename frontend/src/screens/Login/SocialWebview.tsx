import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import { getSocialLogin } from '../../store/login';

// import { useAsyncStorage } from '@react-native-community/async-storage';
// const { setItem } = useAsyncStorage('토큰 key 값');

export function SocialWebview({ closeSocialModal, source }: any) {
	const dispatch = useDispatch();
	const INJECTED_JAVASCRIPT =
		'(function() {if(window.document.getElementsByTagName("pre").length>0){window.ReactNativeWebView.postMessage((window.document.getElementsByTagName("pre")[0].innerHTML));}})();';

	const _handleMessage = async (event: any) => {
		console.log(JSON.parse(event.nativeEvent.data));
		let result = JSON.parse(event.nativeEvent.data);
		let success = result.message;
		if (success) {
			const data = {
				meetingID: result.id, // pk
				meetingName: result.name,
				userToken: result.Authorization,
			};
			// let userToken = result.Authorization;
			try {
				dispatch(getSocialLogin(data));
			} catch (e) {
				console.log(e);
			}
		}
		closeSocialModal();
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
