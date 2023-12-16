export default interface DefaultFields {
	id: string;
	collectionId: string;
	collectionName: string;
	created: string;
	updated: string;
}
export interface DefaultAuthFields extends DefaultFields {
	username: string;
	email: string;
	emailVisibility: boolean;
	verified: boolean;
}
