export default interface OAuthPayload<C> {
	provider: string;
	code: string;
	codeVerifier: string;
	redirectUrl: string;
	createData: C;
}
