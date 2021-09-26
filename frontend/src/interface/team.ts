export interface requestTeamAPI {
	user: number;
	id: number;
	name: string;
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
}
