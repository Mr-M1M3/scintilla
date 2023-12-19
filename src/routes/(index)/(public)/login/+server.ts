import type GC from '$lib/types/GeneralMember.type';
import type { OAuthFailure } from '$lib/types/OAuthFailure.type';
import type OAuthSuccess from '$lib/types/OAuthSuccess.type';

export async function POST({ request, locals, cookies }) {
	const login_credentials = {
		code: request.headers.get('X-OAuth-Code') ?? '',
		codeVerifier: request.headers.get('X-OAuth-Code-Verifier') ?? '',
		provider: request.headers.get('X-OAuth-Provider') ?? '',
		redirectUrl: 'http://localhost:5173/login'
	};
	const logged_in = await locals.requester.POST<unknown, OAuthSuccess<GC, unknown>, OAuthFailure>(
		'/api/collections/general_members/auth-with-oauth2',
		login_credentials,
		{
			'Content-Type': 'application/json'
		}
	);
	if (logged_in.success) {
		cookies.set('session', logged_in.original.token, {
			path: '/',
			expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
		});
		return new Response(null, {
			headers: {
				'X-OAuth-Goto': '/dashboard'
			}
		});
	} else {
		return new Response(null, {
			headers: {
				'X-OAuth-Goto': '/login'
			}
		});
	}
}
