import React, { useState, useCallback } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SocialWebviewModal } from './Login/SocialWebviewModal';
// prettier-ignore
import {
  SafeAreaView,
  View,
  Text,
  UnderlineText,
  TextInput,
  TouchableView,
  TopBar,
  MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import { useAutoFocus, AutoFocusProvider } from '../contexts';
import { Colors } from 'react-native-paper';

export default function Login() {
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
	const goSignUp = useCallback(() => navigation.navigate('SignUp'), []);

	const onPressSocial = useCallback(async (social: any) => {
		setSocialModalVisible(true);
		setSource(`http://localhost:8000/accounts/`);
	}, []);
	const onCloseSocial = useCallback(async () => {
		setSocialModalVisible(false);
	}, []);

	return (
		<SafeAreaView>
			<View style={[styles.view]}>
				<AutoFocusProvider contentContainerStyle={[styles.keyboardAwareFocus]}>
					{source !== '' && (
						<SocialWebviewModal
							visible={socialModalVisible}
							source={source}
							closeSocialModal={onCloseSocial}
						/>
					)}
					{source === '' && (
						<>
							<View style={[styles.textView, {}]}>
								<Text style={styles.text}>Make your Plan</Text>
							</View>
							<TouchableView
								style={[
									styles.touchableView,
									{ backgroundColor: Colors.yellow600 },
								]}
								onPress={() => onPressSocial('')}
							>
								<Icon name="chat" size={25} />
								<Text
									style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}
								>
									카카오 로그인
								</Text>
							</TouchableView>
						</>
					)}
				</AutoFocusProvider>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
	text: { fontSize: 30, textAlign: 'center', marginBottom: 20 },
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
