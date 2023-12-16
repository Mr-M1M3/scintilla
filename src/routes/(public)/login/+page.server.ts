import type AUthMethods from '$lib/types/AuthMethod.type.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user !== null) {
		redirect(303, '/dashboard');
	}

	const auth_methods = await locals.requester.GET<AUthMethods, never>(
		'/api/collections/general_members/auth-methods'
	);
	if (!auth_methods.success) {
		error(500, 'internal server error');
	}
	auth_methods.original.authProviders.forEach(provider => {
		// TODO: 
		if(provider.name === "google"){
			provider.authUrl += 'http://localhost:5173/login'
		}
	})
	return {
		auth_providers: auth_methods.original.authProviders
	};
}
