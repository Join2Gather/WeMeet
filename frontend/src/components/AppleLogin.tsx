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
import { StyleSheet, View, Text, Alert, ScrollView } from 'react-native';
import {
	appleAuth,
	AppleButton,
} from '@invertase/react-native-apple-authentication';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAppleToken } from '../store/login';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Colors } from 'react-native-paper';

import jwtDecode from 'jwt-decode';

/**
 * You'd technically persist this somewhere for later use.
 */
let user = null;

/**
 * Fetches the credential state for the current user, if any, and updates state on completion.
 */
async function fetchAndUpdateCredentialState(
	updateCredentialStateForUser: any,
	user: any
) {
	if (user === null) {
		updateCredentialStateForUser('N/A');
	} else {
		const credentialState = await appleAuth.getCredentialStateForUser(user);
		if (credentialState === appleAuth.State.AUTHORIZED) {
			updateCredentialStateForUser('AUTHORIZED');
		} else {
			updateCredentialStateForUser(credentialState);
		}
	}
}

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
	var user = '';
	// const [credentialStateForUser, updateCredentialStateForUser] =
	// 	useState<any>(-1);
	const [userToken, setToken] = useState<any>('');
	const [status, setStatus] = useState<any>('');
	const [email, setEmail] = useState<any>('');
	const [fullName, setFullName] = useState<any>('');
	const [identityToken, setInToken] = useState<any>('');
	const [state, setState] = useState<any>('');
	const [users, setUsers] = useState<any>('');
	const [authCode, setAuthCode] = useState<any>('');
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setAppleToken(userToken));
	}, [userToken]);

	const onAppleButtonPress = async () => {
		let response: object = {};
		let appleId: string = '';
		let appleToken: string = '';
		let appleEmail: string = '';
		try {
			const appleAuthRequestResponse = await AppleAuthentication.signInAsync({
				requestedScopes: [
					AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
					AppleAuthentication.AppleAuthenticationScope.EMAIL,
				],
			});

			const {
				realUserStatus,
				authorizationCode,
				email,
				fullName,
				identityToken,
				state,
				user,
			} = appleAuthRequestResponse;
			console.log(appleAuthRequestResponse);
			// fetchAndUpdateCredentialState(setToken, user).catch((error) =>
			// 	// setToken(`Error: ${error.code}`)
			// );

			if (identityToken) {
				const decoded = jwtDecode(identityToken);
				console.log(decoded);

				// setToken(access_token);
			} else {
				Alert.alert('로그인 실패');
			}
		} catch (error: any) {
			if (error.code === appleAuth.Error.CANCELED) {
				console.warn('User canceled Apple Sign in.');
			} else {
				console.error(error);
			}
		}
	};
	// useEffect(() => {
	// 	if (!appleAuth.isSupported) return;

	// 	fetchAndUpdateCredentialState(updateCredentialStateForUser, user).catch(
	// 		(error: errorType) => updateCredentialStateForUser(`Error: ${error.code}`)
	// 	);
	// }, []);

	// useEffect(() => {
	// 	if (!appleAuth.isSupported) return;

	// 	return appleAuth.onCredentialRevoked(async () => {
	// 		console.warn('Credential Revoked');
	// 		fetchAndUpdateCredentialState(updateCredentialStateForUser, user).catch(
	// 			(error) => updateCredentialStateForUser(`Error: ${error.code}`)
	// 		);
	// 	});
	// }, []);

	// if (!appleAuth.isSupported) {
	// 	return (
	// 		<View style={[styles.container, styles.horizontal]}>
	// 			<Text style={styles.textColor}>Apple Authentication is not supported on this device.</Text>
	// 		</View>
	// 	);
	// }

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
