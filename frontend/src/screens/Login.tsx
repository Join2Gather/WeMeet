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

	const onPressSocial = useCallback(async (social: any) => {
		setSocialModalVisible(true);
		setSource(`http://localhost:8000/accounts/`);
	}, []);
	const onCloseSocial = useCallback(async () => {
		setSocialModalVisible(false);
	}, []);

	return (
		<SafeAreaView
			style={{ padding: 0, margin: 0, backgroundColor: Colors.blue500 }}
		>
			<View
				style={[
					styles.view,
					{ backgroundColor: Colors.blue500, margin: 0, padding: 0 },
				]}
			>
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
							<View
								style={[styles.textView, { backgroundColor: Colors.blue500 }]}
							>
								<Text style={styles.text}>WE MEET</Text>
							</View>
							<TouchableView
								style={[
									styles.touchableView,
									{ backgroundColor: Colors.white },
								]}
								onPress={() => onPressSocial('')}
							>
								{/* <Icon
									name="chat"
									size={25}
									// style={{ color: Colors.yellow800 }}
								/> */}
								<Text
									style={{
										fontSize: 20,
										fontWeight: 'bold',
										marginLeft: 10,
										color: Colors.blue700,
									}}
								>
									카카오 로그인
								</Text>
							</TouchableView>
							<Text style={styles.buttonUnderText}>
								카카오 계정으로 간편로그인 하세요.
							</Text>
							<Text
								style={{ position: 'absolute', bottom: 0, color: Colors.white }}
							>
								make your plan
							</Text>
						</>
					)}
				</AutoFocusProvider>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
	text: {
		fontSize: 65,
		textAlign: 'center',
		marginBottom: 120,
		fontWeight: '200',
		color: '#FFF',
	},
	buttonUnderText: {
		marginTop: 8,
		fontSize: 15,
		fontWeight: '300',
		marginLeft: 10,
		color: '#FFF',
	},
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
		height: 48,
		borderRadius: 10,
		width: '70%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
