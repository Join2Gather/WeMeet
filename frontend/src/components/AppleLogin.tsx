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
import { Alert, StyleSheet } from 'react-native';
import {
	appleAuth,
	AppleButton
} from '@invertase/react-native-apple-authentication';
import { useDispatch, useSelector } from 'react-redux';
import * as AppleAuthentication from 'expo-apple-authentication';

import { appleLogin } from '../store/login';

import { Colors } from 'react-native-paper';
import { RootState } from '../store';
import {
	AppleAuthenticationCredentialState,
	AppleAuthenticationRefreshOptions
} from 'expo-apple-authentication';
import jwt_decode from 'jwt-decode';
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

interface decode {
	email: string;
}

interface functionParam {
	setState: React.Dispatch<any>;
	user: string;
}

async function fetchState({ setState, user }: functionParam) {
	const state = await AppleAuthentication.getCredentialStateAsync(user);

	if (state === AppleAuthenticationCredentialState.AUTHORIZED) {
		setState('AUTHORIZED');
	} else {
		setState('other');
	}
}

export function AppleLogin() {
	const { appleUser } = useSelector(({ login }: RootState) => ({
		appleUser: login.appleUser
	}));

	const [userToken, setToken] = useState('');
	const [state, setState] = useState<any>('');
	const dispatch = useDispatch();

	// useEffect(() => {
	// 	dispatch(setAppleToken(userToken));
	// }, [userToken]);

	const onAppleButtonPress = async () => {
		try {
			let appleAuthRequestResponse;

			appleAuthRequestResponse = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL
				]
			});

			const { authorizationCode, email, user, identityToken } =
				appleAuthRequestResponse;
			if (identityToken && authorizationCode) {
				const decoded: decode = jwt_decode(identityToken);
				const { email } = decoded;

				dispatch(appleLogin({ code: authorizationCode, email: email }));
			}
			if (authorizationCode && email && user) {
			}
			if (user) {
				await fetchState({ setState, user });

				if (authorizationCode && email && user) {
					dispatch(appleLogin({ code: authorizationCode, email: email }));
				}
				// }
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
			height: 1
		},
		shadowOpacity: 0.21,
		shadowRadius: 1.0
	},
	header: {
		margin: 10,
		marginTop: 30,
		fontSize: 18,
		fontWeight: '600'
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'pink'
	},
	horizontal: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
	textColor: {
		color: Colors.black,
		fontSize: 30
	}
});
