// TODO: Respond 400 if user doesn't exist
import type AUthMethods from '$lib/types/AuthMethod.type';
import { GOOGLE_OAUTH_REDIRECTED_DOMAIN } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import log_error from '$lib/server/utils/error-logger.util.js';

export async function load({ locals }) {
	if (locals.user !== null) {
		redirect(303, '/dashboard');
	}

	const auth_methods = await locals.requester.GET<AUthMethods, never>(
		'/api/collections/general_members/auth-methods'
	);
	if (!auth_methods.success) {
		const logged_error = log_error(auth_methods);
		error(500, {
			message: 'internal server error',
			id: logged_error.eid
		});
	}
	auth_methods.original.authProviders.forEach((provider) => {
		if (provider.name === 'google') {
			provider.authUrl += `${GOOGLE_OAUTH_REDIRECTED_DOMAIN}/login`;
		}
	});
	return {
		auth_providers: auth_methods.original.authProviders
	};
}
