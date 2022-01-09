/* eslint-disable no-console */
/**
 * Copyright (c) 2016-present Invertase Limited & Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this library except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import {
	appleAuth,
	AppleButton,
} from '@invertase/react-native-apple-authentication';
import { useDispatch, useSelector } from 'react-redux';

import { appleLogin, setAppleToken } from '../store/login';

import { Colors } from 'react-native-paper';

/**
 * Starts the Sign In flow.
 */
// async function onAppleButtonPress(setToken: any, user: any) {
// 	console.warn('Beginning Apple Authentication');

// 	// start a login request
// }

interface errorType {
	code: number;
}

export function AppleLogin() {
	const [userToken, setToken] = useState('');

	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setAppleToken(userToken));
	}, [userToken]);

	const onAppleButtonPress = async () => {
		try {
			const appleAuthRequestResponse = await appleAuth.performRequest({
				requestedOperation: appleAuth.Operation.LOGIN,
				requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
			});
			const { authorizationCode, email } = appleAuthRequestResponse;
			appleAuthRequestResponse;

			if (authorizationCode && email) {
				dispatch(appleLogin({ code: authorizationCode, email: email }));
			}
		} catch (error: any) {
			if (error.code === appleAuth.Error.CANCELED) {
				console.warn('User canceled Apple Sign in.');
			} else {
				console.error(error);
			}
		}
	};

	return (
		<AppleButton
			style={styles.appleButton}
			cornerRadius={10}
			buttonStyle={AppleButton.Style.WHITE}
			buttonType={AppleButton.Type.SIGN_IN}
			onPress={() => onAppleButtonPress()}
		/>
	);
}

const styles = StyleSheet.create({
	appleButton: {
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
	header: {
		margin: 10,
		marginTop: 30,
		fontSize: 18,
		fontWeight: '600',
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'pink',
	},
	horizontal: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10,
	},
	textColor: {
		color: Colors.black,
		fontSize: 30,
	},
});
