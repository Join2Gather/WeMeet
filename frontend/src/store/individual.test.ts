import type { Individual } from '../interface/individual';
import { individualInitialState } from '../lib/util/individualReducerHelper';
import individual, {
	initialIndividualTimetable,
	makeHomeTime
} from './individual';
describe('individual reducer', () => {
	let initial: Individual;
	beforeEach(() => {
		initial = individualInitialState;
	});
	it('시간표 초기화 [initialIndividualTimetable]]', () => {
		const state = individual(initial, initialIndividualTimetable());
		expect(state.individualTimesText).toHaveLength(13);
	});
	it('홈 화면 시간표 만들기 [makeHomeTime]', () => {
		const state = individual(initial, makeHomeTime());
	});
});
