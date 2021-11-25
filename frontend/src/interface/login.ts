export interface Login {
	id: number;
	name: string;
	user: number;
	token: string;
	clubs: Array<any>;
	kakaoDates: Array<any>;
	uri?: string;
	error: string;
	color: string;
	peopleCount: number;
	response: '';
}

export interface kakaoLoginAPI {
	id: number;
	name: string;
	user: number;
	token: string;
	clubs: Array<any>;
	kakaoDates: Array<any>;
}

export interface userMeAPI {
	user: number;
	id: number;
	token: string;
}
