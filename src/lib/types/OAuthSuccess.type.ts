export default interface OAuthSuccess<Record, RawUser> {
	token: string;
	record: Record & {
		id: string;
		collectionId: string;
		collectionName: string;
		username: string;
		verified: boolean;
		emailVisibility: boolean;
		email: string;
		created: string;
		updated: string;
	};
	meta: {
		id: string;
		name: string;
		username: string;
		email: string;
		avatarUrl: string;
		accessToken: string;
		refreshToken: string;
		rawUser: RawUser;
	};
}
