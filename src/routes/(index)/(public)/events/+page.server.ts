import log_error from '$lib/server/utils/error-logger.util.js';
import type { EventRecord } from '$lib/types/Event.Record.type.js';
import type ListResult from '$lib/types/ListResult.type.js';
import { error } from '@sveltejs/kit';

type EventList = ListResult<EventRecord>;
export async function load({ locals, url }) {
	const events = await locals.requester.GET<EventList, unknown>(
		`/api/collections/events/records?page=${
			url.searchParams.get('page') ?? 1
		}&perPage=10&fields=name,id,type,submission_deadline,description,registration_url`
	);
	if (events.success) {
		return {
			events: events.original
		};
	} else {
		const logged_error = log_error(events);
		error(500, {
			message: 'internal server error',
			id: logged_error.eid
		});
	}
}
