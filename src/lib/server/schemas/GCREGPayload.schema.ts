import { z } from 'zod';

const GC_REG_PAYLOAD = z.object({
	name: z.string().min(1, 'name cannot be empty'),
	class: z.number().min(3, 'lies!!!').max(12, 'lies!!!'),
	section: z.string().min(1, 'cannot be empty'),
	roll: z.number().min(1, 'invalid roll no'),
	contact_self: z
		.string()
		.regex(/^(\+?8801|01)(1|3|4|5|6|7|8|9)(\d){8}$/, 'invalid bangladeshi phone number'),
	contact_parent: z
		.string()
		.regex(/^(\+?8801|01)(1|3|4|5|6|7|8|9)(\d){8}$/, 'invalid bangladeshi phone number'),
	oauth_code: z.string(),
	code_verifier: z.string(),
	provider: z.string()
});

export default GC_REG_PAYLOAD;
export type GCRegPayload = z.infer<typeof GC_REG_PAYLOAD>;
