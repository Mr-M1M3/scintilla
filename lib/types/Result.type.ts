type Ok<T> = {
	success: true;
	original: T;
};
type Err<E> = {
	success: false;
	original: E;
};

type Result<T, E> = Ok<T> | Err<E>;

export default Result;
