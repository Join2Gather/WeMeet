import {
	getGroupDates,
	getIndividualDates,
	getOtherConfirmDates,
	makeInitialIndividual
} from '../store/timetable';

import type { requestGroupDatesAPI } from '../interface';
import type { Dispatch } from 'react';

interface otherInfo {
	confirmClubs: string[];
	confirmDatesTimetable: any;
}

export function getGroupIndividualTime(
	getInfo: requestGroupDatesAPI,
	otherInfo: otherInfo,
	dispatch: Dispatch<any>
) {
	const { id, token, uri, user } = getInfo;
	const { confirmClubs, confirmDatesTimetable } = otherInfo;
	dispatch(makeInitialIndividual());
	dispatch(getGroupDates({ id, user, token, uri }));

	setTimeout(() => {
		dispatch(
			getOtherConfirmDates({
				confirmClubs,
				confirmDatesTimetable,
				isGroup: true
			})
		);
	}, 200);

	setTimeout(() => {
		dispatch(getIndividualDates({ id, user, token, uri }));
		dispatch(
			getOtherConfirmDates({
				confirmClubs,
				confirmDatesTimetable,
				isGroup: false
			})
		);
	}, 400);
}
