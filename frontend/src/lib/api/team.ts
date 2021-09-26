import axios from 'axios';
import client from './client';
import type { requestTeamAPI } from '../../interface';

export const postTeamName = ({ user, id, name }: requestTeamAPI) => {
	const data = JSON.stringify(name);
	return client.post(`/users/${user}/profiles/${id}/clubs`, data);
};
