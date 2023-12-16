import type OAuthPayload from './OAuthPayload.type';

export default interface OAuthFailure {
	code: number;
	message: string;
	data: {
		[K in keyof Omit<OAuthPayload<never>, 'createData'>]: {
			code: string;
			message: string;
		};
	};
}
