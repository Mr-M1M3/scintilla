import GC_REG_PAYLOAD, { type GCRegPayload } from '$lib/server/schemas/GCREGPayload.schema';
import {GOOGLE_OAUTH_REDIRECTED_DOMAIN} from "$env/static/private";
import type AUthMethods from '$lib/types/AuthMethod.type';
import type GC from '$lib/types/GeneralMember.type';
import type OAuthFailure from '$lib/types/OAuthFailure.type';
import type OAuthPayload from '$lib/types/OAuthPayload.type';
import type OAuthSuccess from '$lib/types/OAuthSuccess.type';
import { error, redirect, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

export async function load({ locals }) {
	if (locals.user !== null) {
		redirect(303, '/dashboard');
	}
	// TODO: GET collection name from ENV
	const auth_methods = await locals.requester.GET<AUthMethods, never>(
		'/api/collections/general_members/auth-methods'
	);
	if (!auth_methods.success) {
		console.error(auth_methods);
		error(500, `internal server error`);
	}
	auth_methods.original.authProviders.forEach((provider) => {
		if (provider.name === 'google') {
			provider.authUrl += `${GOOGLE_OAUTH_REDIRECTED_DOMAIN}/register`;
		}
	});

	const superforms_data = await superValidate(GC_REG_PAYLOAD);
	return {
		superforms_data,
		oauth_providers: auth_methods.original.authProviders
	};
}
export const actions = {
	async default({ request, locals, cookies }) {
		const form_data = await superValidate(request, GC_REG_PAYLOAD);
		if (!form_data.valid) {
			return fail(400, { form_data });
		}
		const user_credentials = form_data.data;
		const created_data = await locals.requester.POST<
			OAuthPayload<Omit<GCRegPayload, 'oauth_code' | 'code_verifier' | 'provider'>>,
			OAuthSuccess<GC, unknown>,
			OAuthFailure
		>(
			'/api/collections/general_members/auth-with-oauth2',
			{
				provider: user_credentials.provider,
				code: user_credentials.oauth_code,
				codeVerifier: user_credentials.code_verifier,
				redirectUrl: 'http://localhost:5173/register',
				createData: {
					name: user_credentials.name,
					class: user_credentials.class,
					section: user_credentials.section,
					roll: user_credentials.roll,
					contact_parent: user_credentials.contact_parent,
					contact_self: user_credentials.contact_self
				}
			},
			{
				'Content-Type': 'application/json'
			}
		);
		if (!created_data.success) {
			if (created_data.reason === 'failure') {
				return fail(400, {form_data, details: created_data.details})
			} else {
				error(500, 'internal server error');
			}
		} else {
			cookies.set('session', created_data.original.token, {
				path: '/',
				expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
			});
			redirect(307, '/dashboard');
		}
	}
};
