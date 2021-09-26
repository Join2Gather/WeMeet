import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {
	SafeAreaView,
	UnderlineText,
	TextInput,
	TouchableView,
	TopBar,
	MaterialCommunityIcon as Icon,
} from '../theme/navigation';
import Icons from 'react-native-vector-icons/AntDesign';
import { useAutoFocus, AutoFocusProvider } from '../contexts';
import { Colors } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { postTeamName } from '../store/team';
import { ModalInput } from '../components';
import { NavigationHeader } from '../theme';
import { useLayout } from '../hooks';

export default function TeamList() {
	const { user, id, clubs } = useSelector(({ login }: RootState) => ({
		user: login.user,
		id: login.id,
		clubs: login.clubs,
	}));
	const [name, setName] = useState('');
	const onPostClubName = useCallback(() => {
		postTeamName({ user, id, name });
	}, [name]);
	const [modalVisible, setModalVisible] = useState(false);
	const [layout, setLayout] = useLayout(); // -1-

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
			<View onLayout={setLayout} style={styles.view}>
				<NavigationHeader title="모임 목록" />
				<Text style={styles.headerUnderText}>Plan list</Text>
				{/* <View style={{ height: 50, flexGrow: 0 }}> */}
				{!clubs[0].name && (
					<TouchableView
						style={[
							styles.teamListTouchableView,
							{ width: '100%', justifyContent: 'space-between' },
							// { width: '120%', justifyContent: 'flex-start' },
						]}
					>
						<View style={styles.rowCircle} />
						<Text style={styles.teamTitle}>아직 아무런 모임이 없네요 😭</Text>
					</TouchableView>
				)}
				<FlatList
					style={{
						height: layout.height * 0.8,
						flexGrow: 0,
						// paddingTop: '-20%',
					}}
					data={clubs}
					renderItem={({ item }) => (
						<TouchableView
							style={[
								styles.teamListTouchableView,
								{
									width: '100%',
									justifyContent: 'space-between',
									opacity: 1,
								},
								// { width: '120%', justifyContent: 'flex-start' },
							]}
						>
							<View style={styles.rowCircle} />
							<Text style={styles.teamTitle}>{item.name}</Text>
							<Icons size={15} name="right" style={styles.iconStyle} />
						</TouchableView>
					)}
					keyExtractor={(item, index) => String(item.id)}
					// ItemSeparatorComponent={() => (
					// 	<View style={{ borderBottomWidth: 1 }} />
					// )}
				/>
				{/* </View> */}
				<View
					style={{
						// paddingLeft: layout.width,
						// paddingRight: layout.width,
						// paddingBottom: layout.width,
						// paddingTop: layout.width,
						padding: layout.width,
						paddingTop: 5,
						paddingBottom: 10,
						// alignItems: 'flex-start',
						// justifyContent: 'flex-end',
						opacity: 0.5,
						backgroundColor: '#017bff',
						// borderRadius: 20,
						position: 'absolute',
						bottom: 0,
					}}
				></View>
				<ModalInput
					modalVisible={modalVisible}
					setModalVisible={setModalVisible}
				/>
			</View>

			<TouchableView
				onPress={() => setModalVisible(true)}
				style={[styles.touchableView, { backgroundColor: '#017bff' }]}
			>
				<Text style={styles.loginText}>새 모임 생성</Text>
			</TouchableView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	view: { justifyContent: 'center', backgroundColor: Colors.white },
	headerUnderText: {
		fontFamily: 'SCDream3',
		fontSize: 16,
		marginTop: 13,
		marginBottom: 39,
		letterSpacing: -0.3,
		textAlign: 'center',
		backgroundColor: 'white',
	},

	text: {
		fontSize: 60,
		textAlign: 'center',
		marginBottom: 120,
		letterSpacing: -3,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	buttonUnderText: {
		marginTop: 12,
		fontSize: 12,
		color: '#FFF',
		fontFamily: 'SCDream3',
	},
	loginText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 20,
		marginLeft: 10,
		color: Colors.white,
	},
	keyboardAwareFocus: {
		flex: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center',
	},
	rowCircle: {
		// flexDirection: 'row',
		padding: 7,
		alignItems: 'flex-start',
		justifyContent: 'flex-end',

		backgroundColor: '#017bff',
		borderRadius: 20,
		position: 'absolute',
		top: 14,
		left: 40,
	},
	teamTitle: {
		fontSize: 16,
		fontFamily: 'SCDream3',
		color: '#000',
		position: 'absolute',
		letterSpacing: -0.5,
		left: 75,
	},
	iconStyle: {
		position: 'absolute',
		right: 40,
	},
	textView: { width: '100%', padding: 5, marginBottom: 30 },
	textInput: { fontSize: 24, padding: 10 },
	textInputView: { marginTop: 5, borderRadius: 10 },
	touchableView: {
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
		marginTop: 50,
		// position: 'absolute',
		// bottom: Platform.select({ ios: 10, android: 10 }), // -3-
		// marginBottom: 53,
	},
	teamListTouchableView: {
		flexDirection: 'row',
		height: 40,
		borderRadius: 10,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: 'black',
		backgroundColor: 'white',
		shadowOffset: {
			width: 1,
			height: 1,
		},
		// shadowOpacity: 0.21,
		// shadowRadius: 1.0,
		// marginBottom: 10,
	},
});
