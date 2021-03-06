import client from './client';

import type {
	requestGroupDatesAPI,
	requestIndividualDatesAPI,
	postIndividualDatesAPI,
	postConfirmAPI,
	getSnapShotAPI
} from '../../interface';
import { makeHeader } from '../util/header';
// 개인 시간 받아오기
export const getIndividualDates = ({
	user,
	id,
	uri,
	token
}: requestIndividualDatesAPI) => {
	const headers = makeHeader(token);
	return client.get(`users/${user}/profiles/${id}/clubs/${uri}/individual`, {
		headers
	});
};

// 팀 시간 받아오기
export const getGroupDates = ({
	user,
	id,
	uri,
	token
}: requestGroupDatesAPI) => {
	const headers = makeHeader(token);
	return client.get(`users/${user}/profiles/${id}/clubs/${uri}/group`, {
		headers
	});
};

// 개인 시간 보내기
export const postIndividualTime = ({
	user,
	id,
	uri,
	dates,
	token
}: postIndividualDatesAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify(dates);

	return client.post(`users/${user}/profiles/${id}/clubs/${uri}`, data, {
		headers
	});
};

// 그룹 시간 개별 확정
export const postConfirm = ({ user, id, uri, date, token }: postConfirmAPI) => {
	const headers = makeHeader(token);
	const data = JSON.stringify(date);

	return client.post(
		`users/${user}/profiles/${id}/clubs/${uri}/confirm/ok`,
		data,
		{
			headers
		}
	);
};

// 스냅샷 확인
export const getSnapShot = ({ id, uri, user, token }: getSnapShotAPI) => {
	const headers = makeHeader(token);

	return client.get(`users/${user}/profiles/${id}/clubs/${uri}/snapshot`, {
		headers
	});
};

// 스냅샷 생성
export const confirmSnapShot = ({ id, uri, user, token }: getSnapShotAPI) => {
	const headers = makeHeader(token);
	const data = null;
	return client.post(
		`users/${user}/profiles/${id}/clubs/${uri}/confirm`,
		data,
		{ headers }
	);
};

// 확정 시간 되돌리기
export const revertConfirm = ({ id, uri, user, token }: getSnapShotAPI) => {
	const headers = makeHeader(token);
	const data = null;
	return client.post(
		`users/${user}/profiles/${id}/clubs/${uri}/confirm/revert`,
		data,
		{ headers }
	);
};
