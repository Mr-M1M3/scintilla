import type { Result } from '$lib/types/Result.type';
import util from 'util';

type LoggedErr<T extends Result<unknown, unknown, unknown>> = {
	error: T;
	eid: string;
};
export default function log_error<T extends Result<unknown, unknown, unknown>>(
	error: T
): LoggedErr<T> {
	const time = new Date();
	const eid: string = crypto.randomUUID();
	console.error(`\n----\n${eid}\n${time}\n\n`, util.inspect(error, { depth: null }), `\n\n----`);
	return { error, eid };
}
