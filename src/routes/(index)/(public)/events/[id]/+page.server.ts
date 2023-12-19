import log_error from '$lib/server/utils/error-logger.util.js';
import type { EventRecord } from '$lib/types/Event.Record.type.js';
import type PBFailure from '$lib/types/PBFailure.type.js';
import type { ViewResult } from '$lib/types/ViewResult.type.js';
import { error, fail } from '@sveltejs/kit';

export async function load({ locals, params }) {
	const event = await locals.requester.GET<ViewResult<EventRecord>, PBFailure<EventRecord>>(
		`/api/collections/events/records/${params.id}`
	);
	if (!event.success) {
		if (event.reason === 'failure') {
			fail(event.details.code, { message: event.details.message });
		} else {
			const logged_error = log_error(event);
			error(500, {
				id: logged_error.eid,
				message: 'internal server error'
			});
		}
	}else{
        return {
            event: event.original
        }
    }
}
