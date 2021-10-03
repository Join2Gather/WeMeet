/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
NavigationHeader, MaterialCommunityIcon as Icon, Text} from '../theme';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation, Timetable } from '../components';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';

export default function Home() {
	// navigation
	const navigation = useNavigation();
	const goLeft = useCallback(() => navigation.navigate('HomeLeft'), []);
	const goRight = useCallback(
		() => navigation.navigate('HomeRight', { name: 'Jack', age: 32 }),
		[]
	);
	const [scrollEnabled] = useScrollEnabled();
	const [people, setPeople] = useState([]);
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);
	const addPerson = useCallback(() => {}, []);
	const removeAllPersons = useCallback(() => {
		setPeople((notUsed) => []);
		leftRef.current?.resetOffset();
	}, []);
	const deletePerson = useCallback(
		(id: string) => () => {
			leftRef.current?.resetOffset();
			flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
		},
		[]
	);
	const flatListRef = useRef<FlatList | null>(null);

	return (
		<SafeAreaView style={{ backgroundColor: Colors.white }}>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader title="내 일정 등록하기" />
					{/* <TopBar noSwitch>
						<UnderlineText onPress={addPerson} style={styles.text}>
							add
						</UnderlineText>
						<UnderlineText onPress={removeAllPersons} style={styles.text}>
							remove all
						</UnderlineText>
					</TopBar> */}
					{/* <LeftRightNavigation
						ref={leftRef}
						distance={40}
						flatListRef={flatListRef}
						onLeftToRight={goLeft}
						onRightToLeft={goRight}
					></LeftRightNavigation> */}
					<Text style={styles.titleText}>make your plan</Text>
					<View style={styles.rowView}>
						<View
							style={[styles.boxView, { backgroundColor: Colors.blue400 }]}
						/>
						<Text style={styles.infoText}>모임 일정</Text>
						<View
							style={[styles.boxView, { backgroundColor: Colors.grey300 }]}
						/>
						<Text style={styles.infoText}>개인 일정</Text>
						<View style={[styles.boxView, { backgroundColor: Colors.white }]} />
						<Text style={styles.infoText}>비어있는 일정</Text>
					</View>
					<Timetable></Timetable>
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
