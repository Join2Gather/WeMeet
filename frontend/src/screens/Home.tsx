/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, Platform, Image } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
NavigationHeader, MaterialCommunityIcon as Icon, Text} from '../theme';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation, Timetable } from '../components';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { postImage } from '../store/individual';
import { ModalSelect } from '../components';
import * as FileSystem from 'expo-file-system';

export default function Home() {
	const { token, individualDates } = useSelector(
		({ login, individual }: RootState) => ({
			token: login.token,
			individualDates: individual.individualDates,
		})
	);
	// navigation
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const [scrollEnabled] = useScrollEnabled();
	const [people, setPeople] = useState([]);
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectModalVisible, setSelectModalVisible] = useState(false);
	const flatListRef = useRef<FlatList | null>(null);
	const addTimetable = useCallback(() => {
		// navigation.navigate('')
	}, []);
	// image picker
	const [image, setImage] = useState(null);
	const [mode, setMode] = useState('0');
	const onPressPlus = useCallback(() => {
		setMode('1');
	}, []);
	const [day, setDay] = useState('');
	// modal

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('카메라 권한을 승인해주세요');
				}
			}
		})();
	}, []);

	// useEffect(() => {
	// 	if (dates) {
	// 	}
	// }, [dates]);

	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1,
		});
		if (!result.cancelled) {
			const imagePath = result.uri;
			const imageExt = result.uri.split('.').pop();
			const imageMime = `image/${imageExt}`;
			dispatch(postImage({ image: imagePath, token: token }));
		}
	};
	return (
		<SafeAreaView style={{ backgroundColor: Colors.white }}>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader
						title="내 일정 등록하기"
						Left={() => (
							<Icon
								name="timetable"
								size={28}
								color={Colors.black}
								style={{ paddingTop: 1 }}
								onPress={() => setSelectModalVisible(true)}
							/>
						)}
						Right={() => (
							<Icon
								name="plus"
								size={28}
								color={Colors.black}
								style={{ paddingTop: 1 }}
								onPress={onPressPlus}
							/>
						)}
					/>
					{image && (
						<Image
							source={{ uri: image }}
							style={{ width: 200, height: 200 }}
						/>
					)}
					<Text style={styles.titleText}>make your plan</Text>
					<View style={styles.rowView}>
						{mode === '0' && (
							<>
								<View
									style={[styles.boxView, { backgroundColor: Colors.blue400 }]}
								/>
								<Text style={styles.infoText}>모임 일정</Text>
								<View
									style={[styles.boxView, { backgroundColor: Colors.grey300 }]}
								/>
								<Text style={styles.infoText}>개인 일정</Text>
								<View
									style={[styles.boxView, { backgroundColor: Colors.white }]}
								/>
								<Text style={styles.infoText}>비어있는 일정</Text>
							</>
						)}
						{mode === '1' && (
							<>
								<Text style={styles.stepText}>1. 시작 시간 터치</Text>
							</>
						)}
						{mode === '3' && (
							<>
								<Text style={styles.stepText}>3. 종료 시간 터치</Text>
							</>
						)}
					</View>
					<Timetable
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						mode={mode}
						dates={individualDates}
						isGroup={false}
					></Timetable>
					<ModalSelect
						selectModalVisible={selectModalVisible}
						setSelectModalVisible={setSelectModalVisible}
					/>
				</View>
			</ScrollEnabledProvider>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		// marginLeft: 20,
		marginTop: 24,
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 13,
		letterSpacing: -1,
	},
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
	},
	boxView: {
		width: 20,
		height: 14,
		marginRight: 3,
		marginLeft: 15,
		borderWidth: 0.3,
		marginTop: 1,
	},
	titleText: {
		fontSize: 17,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		marginTop: 12,
		letterSpacing: -1,
	},
});
