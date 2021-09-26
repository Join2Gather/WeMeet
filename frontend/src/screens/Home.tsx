/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, UnderlineText,TopBar,
NavigationHeader, MaterialCommunityIcon as Icon} from '../theme';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation } from '../components';
import type { LeftRightNavigationMethods } from '../components';

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
		<SafeAreaView>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader title="Home" />
					<TopBar noSwitch>
						<UnderlineText onPress={addPerson} style={styles.text}>
							add
						</UnderlineText>
						<UnderlineText onPress={removeAllPersons} style={styles.text}>
							remove all
						</UnderlineText>
					</TopBar>
					<LeftRightNavigation
						ref={leftRef}
						distance={40}
						flatListRef={flatListRef}
						onLeftToRight={goLeft}
						onRightToLeft={goRight}
					></LeftRightNavigation>
				</View>
			</ScrollEnabledProvider>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	view: { flex: 1 },
	text: { marginRight: 10, fontSize: 20 },
});
