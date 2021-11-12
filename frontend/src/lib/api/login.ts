import { API_URL } from 'react-native-dotenv';
import axios from 'axios';
import { makeHeader } from '../util/header';
import type { userMeAPI } from '../../interface';

export const getUserMe = ({ id, token, user }: userMeAPI) => {
	const headers = makeHeader(token);
	return axios.get(`${API_URL}users/${user}/profiles/${id}/`, { headers });
};