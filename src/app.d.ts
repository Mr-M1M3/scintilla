import type Requester from '$lib/Requester';
import GC from './lib/types/GeneralMember.type';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			message: string;
			id: string;
		}
		interface Locals {
			user: GC | null;
			requester: Requester;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
