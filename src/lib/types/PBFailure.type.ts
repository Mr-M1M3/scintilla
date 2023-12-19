export default interface PBFailure<R extends Record<string, unknown>> {
	code: number;
	message: string;
	data: {
		[K in keyof R]: {
			code: string;
			message: string;
		};
	};
}
