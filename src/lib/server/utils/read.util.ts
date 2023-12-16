import type { Result } from '$lib/types/Result.type';

export default async function read<T>(req: Request): Promise<Result<T, unknown, unknown>> {
	console.log(req.headers.get('content-type'));
	if (req.headers.get('Content-Type') === 'application/x-www-form-urlencoded') {
		try {
			const form_data = await req.formData();
			const jsonified: Record<string, unknown> = {};
			for (const [k, v] of form_data.entries()) {
				jsonified[k] = replace_malicious_chars_of(v as string);
			}
			return {
				success: true,
				original: jsonified as T
			};
		} catch (e) {
			return {
				success: false,
				reason: 'failure',
				details: 'malformed data'
			};
		}
	} else if (req.headers.get('Content-Type') === 'application/json') {
		try {
			return {
				success: true,
				original: (await req.json()) as T
			};
		} catch (e) {
			return {
				success: false,
				reason: 'failure',
				details: 'malformed data'
			};
		}
	}
	return {
		success: false,
		reason: 'failure',
		details: new TypeError('invalid content type')
	};
}

function replace_malicious_chars_of(str: string): string {
	return str
		.replaceAll('/', ' &#47;')
		.replaceAll(',', '&#44;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('(', '&#40;')
		.replaceAll(')', '&#41;')
		.replaceAll('"', '&quot;');
}
