/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
// prettier-ignore
import {View, Text, NavigationHeader, UnderlineText,
MaterialCommunityIcon as Icon, Switch} from '../theme';
import type { FC } from 'react';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerActions } from '@react-navigation/native';
import { Avatar } from '../components';

const DrawerContent: FC<DrawerContentComponentProps> = (props) => {
	const { navigation } = props;
	const close = useCallback(
		() => navigation.dispatch(DrawerActions.closeDrawer()),
		[]
	);

	return (
		<DrawerContentScrollView {...props} contentContainerStyle={[styles.view]}>
			<NavigationHeader
				Right={() => <Icon name="close" size={24} onPress={close} />}
			/>
			<View style={[styles.content]}>
				<View style={[styles.row]}>
					{/* <Avatar uri={loginUser.avatar} size={40} /> */}
					<Text style={[styles.text, styles.m]}>Hi There</Text>
				</View>
				<View style={[styles.row]}>
					<UnderlineText
						numberOfLines={1}
						ellipsizeMode="tail"
						style={[styles.text, styles.m]}
					>
						wshmin@naver.com
					</UnderlineText>
				</View>
				<View style={[styles.row, { marginTop: 20 }]}>
					<Switch />
				</View>
			</View>
		</DrawerContentScrollView>
	);
};
export default DrawerContent;
const styles = StyleSheet.create({
	view: { flex: 1, padding: 5 },
	row: { flexDirection: 'row', padding: 5, alignItems: 'center' },
	m: { marginLeft: 5 },
	text: { fontSize: 20 },
	content: { flex: 1, padding: 5 },
});
