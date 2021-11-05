export interface Login {
	id: number;
	name: string;
	user: number;
	token: string;
	clubs: Array<any>;
	kakaoDates: Array<any>;
	uri?: string;
}
