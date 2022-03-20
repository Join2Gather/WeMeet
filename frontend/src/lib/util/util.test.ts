import { makeTimetableWithStartEnd } from './makeTimetable';

describe('util functions test', () => {
	it('makeTimetable', () => {
		const { weekTimetableData } = makeTimetableWithStartEnd(0, 0);
		expect(weekTimetableData[0]).toStrictEqual({
			day: 'sun',
			times: {
				0: timeData
			},
			timeBackColor: ['#fff']
		});
	});
});

const timeData = [
	{
		color: '#fff',
		mode: 'normal',
		minute: 0,
		borderBottom: false,
		borderTop: true,
		borderWidth: 0.3
	},
	{
		color: '#fff',
		mode: 'normal',
		minute: 10,
		borderBottom: false,
		borderTop: false,
		borderWidth: 0.3
	},
	{
		color: '#fff',
		mode: 'normal',
		minute: 20,
		borderBottom: false,
		borderTop: false,
		borderWidth: 0.3
	},
	{
		color: '#fff',
		mode: 'normal',
		minute: 30,
		borderBottom: false,
		borderTop: false,
		borderWidth: 0.3
	},
	{
		color: '#fff',
		mode: 'normal',
		minute: 40,
		borderBottom: false,
		borderTop: false,
		borderWidth: 0.3
	},
	{
		color: '#fff',
		mode: 'normal',
		minute: 50,
		borderBottom: false,
		borderTop: false,
		borderWidth: 0.3
	}
];
