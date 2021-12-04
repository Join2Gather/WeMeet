export interface requestTeamAPI {
	user: number;
	id: number;
	name: string;
	token: string;
	color: string;
	startTime: number;
	endTime: number;
}

interface days {}

export interface responseTeamAPI {
	id: number;
	name: string;
	uri: string;
	date: Object;
	color: string;
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
	postTeamError: boolean;
	joinTeamError: boolean;
	teamColor: string;
	modalMode: string;
	leaveTeamOK: boolean;
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

export interface changeColorAPI {
	id: number;
	uri: string;
	token: string;
	user: number;
	color: string;
}
