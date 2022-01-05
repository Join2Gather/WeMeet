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
import { StyleSheet, View, Text, Alert } from 'react-native';
import {
	appleAuth,
	AppleButton,
} from '@invertase/react-native-apple-authentication';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setAppleToken } from '../store/login';

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
async function onAppleButtonPress(setToken: any, user: any) {
	console.warn('Beginning Apple Authentication');

	// start a login request
	try {
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
		});

		console.log('appleAuthRequestResponse', appleAuthRequestResponse);

		const {
			user: newUser,
			email,
			nonce,
			identityToken,
			realUserStatus /* etc */,
		} = appleAuthRequestResponse;

		user = newUser;

		fetchAndUpdateCredentialState(setToken, user).catch((error) =>
			setToken(`Error: ${error.code}`)
		);

		if (identityToken) {
			Alert.alert('Token', identityToken);
			// e.g. sign in with Firebase Auth using `nonce` & `identityToken`
			console.log('nonce', nonce, identityToken);
			setToken(identityToken);
		} else {
			Alert.alert('로그인 실패');
		}

		if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
			console.log("I'm a real person!");
			Alert.alert('good');
		}

		console.warn(`Apple Authentication Completed, ${user}, ${email}`);
	} catch (error: any) {
		if (error.code === appleAuth.Error.CANCELED) {
			console.warn('User canceled Apple Sign in.');
		} else {
			console.error(error);
		}
	}
}

interface errorType {
	code: number;
}

export function AppleLogin() {
	var user = '';
	// const [credentialStateForUser, updateCredentialStateForUser] =
	// 	useState<any>(-1);
	const [userToken, setToken] = useState('');
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setAppleToken(userToken));
	}, [userToken]);
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
	// 			<Text>Apple Authentication is not supported on this device.</Text>
	// 		</View>
	// 	);
	// }

	return (
		<AppleButton
			style={styles.appleButton}
			cornerRadius={10}
			buttonStyle={AppleButton.Style.WHITE}
			buttonType={AppleButton.Type.SIGN_IN}
			onPress={() => onAppleButtonPress(setToken, user)}
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
});
