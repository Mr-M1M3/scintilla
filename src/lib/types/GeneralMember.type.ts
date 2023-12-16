import type { DefaultAuthFields } from './DefaultFields.type';
import type { GCRegPayload } from '$lib/server/schemas/GCREGPayload.schema';

export default interface GC {
	record: DefaultAuthFields & Omit<GCRegPayload, 'oauth_code' | 'code_verifier' | 'provider'>;
	token: string;
}
