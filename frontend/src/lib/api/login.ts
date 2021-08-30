import axios from 'axios';
import type { Login, User } from '../../interface';
export const getLogin = ({ id, pw }: Login) => {
	const user = JSON.stringify({
		id: id,
		pw: pw,
	});
	return axios.post(`https://www.google.com`, user);
};
// import axios from 'axios';
// import type { Login, User } from '../../interface';
// export const getLogin = ({ id, pw }: Login) => {
// 	const headers = {
// 		'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
// 		Authorization: `${token}`,
// 		Accept: '*/*',
// 	};
// 	const user = JSON.stringify({
// 		id: id,
// 		pw: pw,
// 	});
// 	return axios.post(`https://www.google.com`, user, { headers });
// };
