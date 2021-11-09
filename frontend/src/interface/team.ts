export interface requestTeamAPI {
	user: number;
	id: number;
	name: string;
	token: string;
}

interface days {}

export interface responseTeamAPI {
	id: number;
	name: string;
	uri: string;
	date: Object;
}

export interface team {
	uri: string;
	date: Object;
	name: string;
	error: string;
}

export interface shareUriAPI {
	user: number;
	id: number;
	token: string;
	uri: string;
}

export interface joinTeamAPI {
	user: number;
	id: number;
	token: string;
	uri: string;
}
