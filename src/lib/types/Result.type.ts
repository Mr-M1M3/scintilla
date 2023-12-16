type Success<T> = {
	success: true;
	original: T;
};
type Failure<F> = {
	success: false;
	reason: 'failure';
	details: F;
};
type Panic<E> = {
	success: false;
	reason: 'panic';
	error: E;
};

export type Result<T, F, E> = Success<T> | Failure<F> | Panic<E>;
