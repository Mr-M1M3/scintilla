import { error } from '@sveltejs/kit';
import Requester from './lib/Requester';
import type GC from './lib/types/GeneralMember.type';
import { CONFIGURED_POCKETBASE_URL } from '$env/static/private';
import log_error from '$lib/server/utils/error-logger.util';
export async function handle({ event, resolve }) {
	const client = new Requester(CONFIGURED_POCKETBASE_URL);
	event.locals.requester = client;
	const token = event.cookies.get('session') ?? '';
	// TODO: GEt collection name form ENV
	const user = await client.POST<null, GC, unknown>(
		'/api/collections/general_members/auth-refresh',
		null,
		{
			Authorization: token
		}
	);
	if (user.success) {
		event.locals.user = user.original;
		event.cookies.set('session', event.locals.user.token, {
			path: '/',
			expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
		});
	} else {
		event.locals.user = null;
		if (user.reason === 'failure') {
			event.cookies.delete('session', {
				path: '/'
			});
		} else {
			const logged_error = log_error(user);
			error(500, {
				message: 'Internal server error',
				id: logged_error.eid
			});
		}
	}
	return resolve(event);
}
export async function handleError({ error, message }) {
	const logged_error = log_error({
		success: false,
		reason: 'panic',
		error
	});
	return {
		message,
		id: logged_error.eid
	};
}
