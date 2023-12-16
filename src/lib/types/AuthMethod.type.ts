export default interface AUthMethods {
	usernamePassword: boolean;
	emailPassword: boolean;
	authProviders: {
		name: string;
		state: string;
		codeVerifier: string;
		codeChallenge: string;
		codeChallengeMethod: string;
		authUrl: string;
	}[];
}
