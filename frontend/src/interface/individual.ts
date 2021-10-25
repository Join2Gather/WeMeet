export interface individual {
	dates: individualTime;
	error: string;
}

export interface postImageAPI {
	image: string;
	token: string;
}
export interface loginEveryTimeAPI {
	id: string;
	password: string;
}

export interface responseImageAPI {
	sun: Array<string>;
	mon: Array<string>;
	tue: Array<string>;
	wed: Array<string>;
	thu: Array<string>;
	fri: Array<string>;
	sat: Array<string>;
}

export interface individualTime {
	sun: { time: Array<string> };
	mon: { time: Array<string> };
	tue: { time: Array<string> };
	wed: { time: Array<string> };
	thu: { time: Array<string> };
	fri: { time: Array<string> };
	sat: { time: Array<string> };
}
