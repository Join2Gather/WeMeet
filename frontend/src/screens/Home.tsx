/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
	StyleSheet,
	FlatList,
	Platform,
	Image,
	ScrollView,
} from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
NavigationHeader, MaterialCommunityIcon as Icon, Text} from '../theme';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation, Spinner, Timetable } from '../components';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
	cloneINDates,
	cloneIndividualDates,
	postImage,
} from '../store/individual';
import { ModalSelect } from '../components';
import * as FileSystem from 'expo-file-system';
import { useMakeTimetable } from '../hooks';
import { getUserMe } from '../store/login';

export default function Home() {
	const {
		token,
		individualDates,
		loginEveryTime,
		postEveryTime,
		id,
		user,
		userMeSuccess,
		confirmClubs,
		confirmDatesTimetable,
		individualTimesText,
	} = useSelector(({ login, individual, loading }: RootState) => ({
		token: login.token,
		id: login.id,
		user: login.user,
		individualDates: individual.individualDates,
		loginEveryTime: loading['individual/LOGIN_EVERYTIME'],
		postEveryTime: loading['individual/POST_EVERYTIME'],
		userMeSuccess: login.userMeSuccess,
		confirmClubs: login.confirmClubs,
		confirmDatesTimetable: login.confirmDatesTimetable,
		individualTimesText: individual.individualTimesText,
	}));
	const dispatch = useDispatch();
	const { defaultDates } = useMakeTimetable();
	useEffect(() => {
		if (!individualDates.length) {
		}
		dispatch(cloneIndividualDates(defaultDates));
	}, []);
	useEffect(() => {
		dispatch(getUserMe({ id, token, user }));
	}, []);
	useEffect(() => {
		dispatch(cloneINDates({ confirmClubs, confirmDatesTimetable }));
	}, [confirmClubs, confirmDatesTimetable]);
	// navigation
	const navigation = useNavigation();

	const [scrollEnabled] = useScrollEnabled();
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectModalVisible, setSelectModalVisible] = useState(false);
	const flatListRef = useRef<FlatList | null>(null);

	// image pic1er
	const [image, setImage] = useState(null);
	const [mode, setMode] = useState('0');
	const onPressPlus = useCallback(() => {
		setMode('1');
	}, []);

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
			<ScrollView>
				<View style={[styles.view]}>
					<NavigationHeader
						title="내 일정 등록하기"
						Left={() => (
							<Icon
								name="timetable"
								size={28}
								color={Colors.white}
								style={{ paddingTop: 1 }}
								onPress={() => setSelectModalVisible(true)}
							/>
						)}
						Right={() => (
							<Icon
								name="plus"
								size={28}
								color={Colors.white}
								style={{ paddingTop: 1 }}
								onPress={onPressPlus}
							/>
						)}
					/>

					<View style={styles.viewHeight}>
						<Text style={styles.titleText}>make your plan</Text>
						<Spinner loading={postEveryTime} />
						<View style={styles.rowView}>
							{mode === '0' && (
								<>
									<View
										style={[
											styles.boxView,
											{ backgroundColor: Colors.blue400 },
										]}
									/>
									<Text style={styles.infoText}>모임 일정</Text>
									<View
										style={[
											styles.boxView,
											{ backgroundColor: Colors.grey300 },
										]}
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
					</View>
					<Timetable
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
						mode={mode}
						setMode={setMode}
						individualDates={individualDates}
						isGroup={false}
						individualTimesText={individualTimesText}
						endIdx={25}
					/>
					<ModalSelect
						selectModalVisible={selectModalVisible}
						setSelectModalVisible={setSelectModalVisible}
					/>
				</View>
			</ScrollView>
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
		marginTop: 26,
	},
	viewHeight: {
		height: 80,
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
		marginTop: 14,
		letterSpacing: -1,
	},
});
