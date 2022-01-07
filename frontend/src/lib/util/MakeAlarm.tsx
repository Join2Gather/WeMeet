import React, { useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Button, Platform, Alert } from 'react-native';
import * as Calendar from 'expo-calendar';
import type { Source } from 'expo-calendar';
import * as Localization from 'expo-localization';
import dayjs from 'dayjs';
import { Colors } from 'react-native-paper';
import ko from 'dayjs/locale/ko';
dayjs.locale('ko');

interface props {
	title: string;
	calStartTime: Date;
	calEndTime: Date;
	endDate: Date;
	alarmTime: number;
	color: string;
}

export default function MakeAlarm({
	title,
	calEndTime,
	calStartTime,
	endDate,
	alarmTime,
	color,
}: props) {
	(async () => {
		const { status } = await Calendar.requestCalendarPermissionsAsync();
		if (status === 'granted') {
			const calendars = await Calendar.getCalendarsAsync(
				Calendar.EntityTypes.EVENT
			);
			Calendar.AlarmMethod.ALARM;
			const find = calendars.find((cal) => cal.title == 'We Meet');
			const defaultCalendarSource: Source | any =
				Platform.OS === 'ios'
					? await getDefaultCalendarSource()
					: { isLocalAccount: true, name: 'We Meet' };
			let calendar_id = '';
			if (find) {
				calendar_id = find.id;
			} else {
				const newCalendarID = await Calendar.createCalendarAsync({
					title: 'We Meet',
					color,
					entityType: Calendar.EntityTypes.EVENT,
					sourceId: defaultCalendarSource.id,
					source: defaultCalendarSource,
					name: 'We Meet',
					ownerAccount: 'personal',
					accessLevel: Calendar.CalendarAccessLevel.OWNER,
				});
				calendar_id = newCalendarID;
			}
			let recRule = {
				frequency: 'weekly',
				interval: 1,
				endDate: endDate,
			};
			let example_event = {
				title: title,
				alarms: [
					{
						relativeOffset: -alarmTime * 60,
						method: Calendar.AlarmMethod.ALERT,
					},
				],
				notes: '모임',
				startDate: calStartTime,
				endDate: calEndTime,
				timeZone: Localization.timezone,
				recurrenceRule: recRule,
			};
			Calendar.createEventAsync(calendar_id, example_event)
				.then((resp_id) => {
					console.log(resp_id, 'it works');
				})
				.catch((err) => console.warn('Err: ', err));
			// });
		} else {
			console.warn('Call');
			// r
		}
	})();
}

async function getDefaultCalendarSource() {
	const defaultCalendar = await Calendar.getDefaultCalendarAsync();
	return defaultCalendar.source;
}
