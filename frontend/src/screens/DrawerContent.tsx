/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useCallback, useState } from 'react';
import {
	Dimensions,
	Platform,
	StyleSheet,
	TouchableHighlight
} from 'react-native';
// prettier-ignore
import {View, Text, NavigationHeader, UnderlineText,
MaterialCommunityIcon as Icon, Switch, SafeAreaView} from '../theme';
import type { FC } from 'react';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Avatar, ModalSelect } from '../components';
import { Colors } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import Font5Icon from 'react-native-vector-icons/FontAwesome5';
import Ionic from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcon } from '../theme';
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import { postImage } from '../store/individual';
const screen = Dimensions.get('screen');

const DrawerContent: FC<DrawerContentComponentProps> = (props) => {
	const {
		inThemeColor,
		myNickName,
		joinClubNum,
		confirmClubNum,
		token,
		color
	} = useSelector(({ login }: RootState) => ({
		inThemeColor: login.inThemeColor,
		myNickName: login.nickname,
		joinClubNum: login.joinClubNum,
		confirmClubNum: login.confirmClubNum,
		token: login.token,
		color: login.inThemeColor
	}));
	const { navigation } = props;
	const close = useCallback(
		() => navigation.dispatch(DrawerActions.closeDrawer()),
		[]
	);
	const onClickOpenChat = useCallback(() => {
		Linking.openURL('https://open.kakao.com/o/sA4uughd');
	}, []);
	const onPressEMail = useCallback(() => {
		Linking.openURL('mailto:wshmin1234@gmail.com');
	}, []);
	const [selectModalVisible, setSelectModalVisible] = useState(false);
	const [mode, setMode] = useState('normal');
	const [image, setImage] = useState(null);
	const onPressEverTime = useCallback(() => {
		setMode('everytime');
		setSelectModalVisible(true);
	}, []);
	const dispatch = useDispatch();
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: false,
			aspect: [4, 3],
			quality: 1
		});
		if (!result.cancelled) {
			const imagePath = result.uri;
			const imageExt = result.uri.split('.').pop();
			const imageMime = `image/${imageExt}`;
			// dispatch(postImage({ image: imagePath, token: token }));
		}
	};
	const onPressGallery = useCallback(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					alert('카메라 권한을 승인해주세요');
				}
			}
		})();
		pickImage();
	}, []);

	// }, []);
	return (
		<SafeAreaView style={{ backgroundColor: inThemeColor }}>
			<View style={{ flex: 1 }}>
				<NavigationHeader
					headerColor={inThemeColor}
					Right={() => (
						<Icon color={Colors.white} name="close" size={31} onPress={close} />
					)}
				/>
				<View style={[styles.content]}>
					<>
						<Text style={styles.titleText}>계정 정보</Text>
						<View style={styles.blankView} />
						<View style={[styles.backgroundView]}>
							<View style={styles.columnView}>
								<TouchableHighlight
									activeOpacity={1}
									underlayColor={Colors.grey300}
									style={styles.touchButtonStyle}
								>
									<View style={styles.rowView}>
										<Font5Icon
											name="user-alt"
											size={21}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}> 닉네임 : {myNickName}</Text>
									</View>
								</TouchableHighlight>

								<TouchableHighlight
									activeOpacity={1}
									style={styles.touchButtonStyle}
								>
									<View style={styles.rowView}>
										<Font5Icon
											name="th-list"
											size={21}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}>
											{' '}
											참여중인 모임 수 : {joinClubNum}
										</Text>
									</View>
								</TouchableHighlight>

								<TouchableHighlight
									activeOpacity={1}
									style={styles.touchButtonStyle}
								>
									<View style={styles.rowView}>
										<Font5Icon
											name="check-square"
											size={21}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}>
											{' '}
											확정 모임 수 : {confirmClubNum}
										</Text>
									</View>
								</TouchableHighlight>
							</View>
						</View>
					</>
					<View style={styles.blankGreyView} />
					<>
						<Text style={styles.titleText}>시간표 불러오기</Text>
						<View style={styles.blankView} />
						<View style={[styles.backgroundView]}>
							<View style={styles.columnView}>
								<TouchableHighlight
									activeOpacity={0.5}
									style={styles.touchButtonStyle}
									onPress={onPressEverTime}
									underlayColor={Colors.grey300}
								>
									<View style={styles.rowView}>
										<MaterialCommunityIcon
											name="clock"
											size={23}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}>에브리 타임</Text>
										<View style={styles.iconView}>
											<Font5Icon
												name="angle-right"
												size={19}
												color={Colors.black}
												style={styles.rightIconStyle}
											/>
										</View>
									</View>
								</TouchableHighlight>
								{/* <TouchableHighlight
									activeOpacity={0.5}
									style={styles.touchButtonStyle}
									onPress={onPressGallery}
									underlayColor={Colors.grey300}
								>
									<View style={styles.rowView}>
										<FontAwesome
											name="photo"
											size={22}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}>갤러리</Text>
										<View style={styles.iconView}>
											<Font5Icon
												name="angle-right"
												size={19}
												color={Colors.black}
												style={styles.rightIconStyle}
											/>
										</View>
									</View>
								</TouchableHighlight> */}
								<ModalSelect
									selectModalVisible={selectModalVisible}
									setSelectModalVisible={setSelectModalVisible}
									mode={mode}
									setMode={setMode}
									color={color}
								/>
							</View>
						</View>
					</>
					<View style={styles.blankGreyView} />
					<>
						<Text style={styles.titleText}>문의 하기</Text>
						<View style={styles.blankView} />
						<View style={[styles.backgroundView]}>
							<View style={styles.columnView}>
								<TouchableHighlight
									activeOpacity={0.5}
									style={styles.touchButtonStyle}
									onPress={onClickOpenChat}
									underlayColor={Colors.grey300}
								>
									<View style={styles.rowView}>
										<Ionic
											name="chatbubble-sharp"
											size={21}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}>카카오톡 </Text>
										<View style={styles.iconView}>
											<Font5Icon
												name="angle-right"
												size={19}
												color={Colors.black}
												style={styles.rightIconStyle}
											/>
										</View>
									</View>
								</TouchableHighlight>
								<TouchableHighlight
									activeOpacity={0.5}
									style={styles.touchButtonStyle}
									onPress={onPressEMail}
									underlayColor={Colors.grey300}
								>
									<View style={styles.rowView}>
										<Ionic
											name="mail-sharp"
											size={21}
											color={inThemeColor}
											style={styles.iconStyle}
										/>
										<Text style={styles.touchText}>이메일 </Text>
										<View style={styles.iconView}>
											<Font5Icon
												name="angle-right"
												size={19}
												color={Colors.black}
												style={styles.rightIconStyle}
											/>
										</View>
									</View>
								</TouchableHighlight>
							</View>
						</View>
					</>
				</View>
			</View>
		</SafeAreaView>
	);
};
export default DrawerContent;
const styles = StyleSheet.create({
	content: { flex: 1 },
	titleText: {
		fontSize: 20,
		alignSelf: 'flex-start',
		fontFamily: 'NanumSquareBold',
		letterSpacing: -1,
		marginLeft: '5%',
		marginTop: 20
	},
	blankView: {
		height: 15
	},
	blankGreyView: {
		height: 20,
		backgroundColor: Colors.grey200,
		marginTop: 20
	},
	backgroundView: {
		borderRadius: 13,
		backgroundColor: Colors.grey100
	},
	columnView: {
		flexDirection: 'column',
		alignContent: 'center'
	},
	touchButtonStyle: {
		// padding: 10,
		// justifyContent: 'center',
		// paddingLeft: 15,
		// paddingRight: 5,
	},
	rowView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
		height: screen.height * 0.05,
		// backgroundColor: Colors.grey400,
		padding: 5
	},
	iconStyle: {
		marginLeft: 10,
		height: 25,
		width: 25,
		marginTop: 3
	},
	touchText: {
		fontSize: 14,
		textAlign: 'center',
		fontFamily: 'NanumSquareR',
		letterSpacing: -1,
		marginLeft: 5
	},
	iconView: {
		alignItems: 'flex-end',
		flex: 1.5,
		backgroundColor: 'transparent'
	},
	rightIconStyle: {
		marginRight: 10
	}
});
