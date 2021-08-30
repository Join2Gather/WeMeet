/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useRef } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
// prettier-ignore
import {SafeAreaView, View, NavigationHeader, MaterialCommunityIcon as Icon, TouchableView, Text} from '../theme';
import { ScrollEnabledProvider, useScrollEnabled } from '../contexts';
import { LeftRightNavigation } from '../components';
import type { LeftRightNavigationMethods } from '../components';
import { Calendar } from 'react-native-calendars';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import type { DateObject } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import { useDispatch, useSelector } from 'react-redux';
import { addDay, removeAllDays } from '../store/calendar';
import { RootState } from '../store';
import { useCalendarTheme } from '../hooks';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
dayjs.extend(utc);
dayjs.extend(timezone);
//prettier-ignore
LocaleConfig.locales['ko'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su','Mo','Tu','We','Th','Fr','Sa'],
  today: 'Aujourd'
};
LocaleConfig.defaultLocale = 'ko';

export default function Home() {
	const { day } = useSelector(({ calendar }: RootState) => ({
		day: calendar.day,
	}));
	// navigation
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const goLeft = useCallback(() => navigation.navigate('HomeLeft'), []);
	const goRight = useCallback(
		() => navigation.navigate('HomeRight', { name: 'Jack', age: 32 }),
		[]
	);
	const open = useCallback(() => {
		navigation.dispatch(DrawerActions.openDrawer());
	}, []);
	const logout = useCallback(() => {
		navigation.navigate('Login');
	}, []);
	// for people
	const [scrollEnabled] = useScrollEnabled();
	const leftRef = useRef<LeftRightNavigationMethods | null>(null);
	const flatListRef = useRef<FlatList | null>(null);

	// calendar
	const [today, setToday] = useState(
		dayjs().tz('Asia/Seoul').locale('ko').format('YYYY-MM-DD')
	);
	const { theme, isDark } = useCalendarTheme();
	console.log(theme);

	const [selected, setSelected] = useState<string>('');

	const onDayPress = useCallback(
		(day: DateObject) => {
			if (dayjs(today).isBefore(day.dateString)) {
				setModalVisible((visible) => !visible);
			}
			const date = day.dateString;
			setSelected(date);
			dispatch(addDay(date));
			console.log('touch');
		},
		[day]
	);
	const onRemoveAllDays = useCallback(() => {
		dispatch(removeAllDays());
	}, []);
	// modal
	return (
		<SafeAreaView>
			<ScrollEnabledProvider>
				<View style={[styles.view]}>
					<NavigationHeader
						title="Home"
						Left={() => <Icon name="menu" size={30} onPress={open} />}
						Right={() => <Icon name="logout" size={30} onPress={logout} />}
					/>
					{isDark && (
						<Calendar markedDates={day} onDayPress={onDayPress} theme={theme} />
					)}
					{!isDark && (
						<Calendar markedDates={day} onDayPress={onDayPress} theme={theme} />
					)}
					{/*버튼*/}
					<TouchableView
						onPress={onRemoveAllDays}
						style={styles.touchableView}
						notification
					>
						<Text style={[styles.text]}>모두 삭제</Text>
					</TouchableView>

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
	touchableView: {
		marginTop: 30,
		flexDirection: 'row',
		height: 50,
		borderRadius: 30,
		width: '80%',
		justifyContent: 'space-evenly',
		alignItems: 'center',
	},
});
