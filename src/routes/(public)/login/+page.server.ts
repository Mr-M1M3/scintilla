import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (locals.user !== null) {
		redirect(303, '/dashboard');
	}
}
