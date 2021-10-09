/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
    TouchableView,
NavigationHeader,  Text} from '../theme';
import Icon from 'react-native-vector-icons/Fontisto';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation, Timetable } from '../components';
import type { LeftRightNavigationMethods } from '../components';
import { Colors } from 'react-native-paper';

export default function Home() {
	// navigation
	const navigation = useNavigation();
	const goLeft = useCallback(() => navigation.navigate('TeamList'), []);
	// const goRight = useCallback(
	// 	() => navigation.navigate('HomeRight', { name: 'Jack', age: 32 }),
	// 	[]
	// );
	const [scrollEnabled] = useScrollEnabled();
	const [people, setPeople] = useState([]);
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);

	const flatListRef = useRef<FlatList | null>(null);

	return (
		<SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader
						title="팀 일정표"
						titleStyle={{ marginLeft: '-8%' }}
						Left={() => (
							<Icon
								name="angle-left"
								size={20}
								onPress={goLeft}
								color={Colors.white}
								style={{ marginLeft: '3%' }}
							/>
						)}
					/>
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
					<View style={styles.rowButtonView}>
						<TouchableOpacity
							style={{
								flexDirection: 'column',
							}}
						>
							<View
								style={[
									styles.boxButtonView,
									{ backgroundColor: Colors.blue400 },
								]}
							/>
							<Text style={styles.infoText}>그룹</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								flexDirection: 'column',
								// marginLeft: 50,
							}}
						>
							<View style={[styles.boxButtonView]} />
							<Text style={styles.infoText}>개인</Text>
						</TouchableOpacity>
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
});
