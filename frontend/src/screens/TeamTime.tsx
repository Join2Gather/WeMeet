/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
    TouchableView,
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation, Timetable } from '../components';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';

export default function Home() {
	// navigation
	const navigation = useNavigation();
	const goLeft = useCallback(() => {
		navigation.goBack();
	}, []);

	const [groupMode, setGroupMode] = useState('group');

	//modal
	const [modalVisible, setModalVisible] = useState(false);
	const [mode, setMode] = useState('0');
	const onPressPlus = useCallback(() => {
		setMode('1');
	}, []);
	return (
		<SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader
						title="팀 일정표"
						titleStyle={{ paddingLeft: 0 }}
						Left={() => (
							<Icon
								name="angle-left"
								size={25}
								onPress={goLeft}
								color={Colors.white}
								// style={{ marginLeft: '3%' }}
							/>
						)}
						Right={() =>
							groupMode === 'group' ? (
								<MIcon
									name="check-bold"
									size={28}
									color={Colors.white}
									style={{ paddingTop: 1 }}
									onPress={onPressPlus}
								/>
							) : (
								<MIcon
									name="plus"
									size={28}
									color={Colors.white}
									style={{ paddingTop: 1 }}
									onPress={() => setMode('1')}
								/>
							)
						}
					/>
					<View style={styles.rowButtonView}>
						{mode === '0' && (
							<>
								<TouchableOpacity
									style={{
										flexDirection: 'column',
									}}
									onPress={() => setGroupMode('group')}
								>
									<View
										style={[
											styles.boxButtonView,
											{
												backgroundColor:
													groupMode === 'group' ? Colors.blue400 : Colors.white,
											},
										]}
									/>
									<Text style={styles.infoText}>그룹</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										flexDirection: 'column',
										// marginLeft: 50,
									}}
									onPress={() => setGroupMode('in')}
								>
									<View
										style={[
											styles.boxButtonView,
											{
												backgroundColor:
													groupMode !== 'group' ? Colors.blue400 : Colors.white,
											},
										]}
									/>
									<Text style={styles.infoText}>개인</Text>
								</TouchableOpacity>
							</>
						)}
						{mode === '1' && (
							<>
								<Text style={styles.stepText}>
									[1] 일정 시작 시간을 터치해주세요
								</Text>
							</>
						)}
						{mode === '2' && (
							<>
								<Text style={styles.stepText}>[2] 일정 시작 분 설정</Text>
							</>
						)}
						{mode === '3' && (
							<>
								<Text style={styles.stepText}>[3] 종료 시간 터치해주세요</Text>
							</>
						)}
					</View>
					<Timetable
						mode={mode}
						setMode={setMode}
						modalVisible={modalVisible}
						setModalVisible={setModalVisible}
					></Timetable>
				</View>
			</ScrollEnabledProvider>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
	rowButtonView: {
		width: '40%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		marginTop: 35,
		marginLeft: '30%',
	},
	rowView: {
		flexDirection: 'row',
		alignContent: 'center',
		justifyContent: 'center',
		marginTop: 24,
	},
	infoText: {
		fontFamily: 'NanumSquareR',
		fontSize: 16,
		textAlign: 'center',
		letterSpacing: -1,
		marginTop: 3,
	},
	boxButtonView: {
		width: 27,
		height: 18,
		borderWidth: 0.3,
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
	stepText: {
		fontFamily: 'NanumSquareBold',
		fontSize: 15,
		letterSpacing: -1,
	},
});
