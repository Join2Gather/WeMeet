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
	joinUri: string;
	date: Object;
	joinName: string;
	name: string;
	user: number;
	id: number;
	error: string;
	joinTeam: boolean;
	joinTeamError: boolean;
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
