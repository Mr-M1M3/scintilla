import Entries from '../types/Entries.type';
import Result from '../types/Result.type';

export default class Requester {
	#host: string;
	#auto_headers: Map<string, string> = new Map();
	constructor(host: string) {
		this.#host = host;
	}
	/**
	 * Send request to the server
	 * @param path The path to be requested. It is appended to the host URL.
	 * @param method The method to be used, must be one of GET, POST, PUT or DELETE
	 * @param headers An object containing Key Value pairs of headers. It will override the value of auto headers
	 * @param body The body to pass
	 * @returns A result object. It will only be the Panic<unknown> variant if for some reason the request could not be made.
	 */
	#request(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'DELETE',
		headers: Record<string, string> | null = null,
		body: unknown = null
	): Result<Promise<Response>, never, unknown> {
		const url = `${this.#host}/${path.charAt(0) === '/' ? path.slice(1) : path}`;
		const headers_to_pass: Record<string, string> = {};
		let payload: string = '';

		for (const [k, v] of this.#auto_headers.entries()) {
			headers_to_pass[k] = v;
		}
		if (headers) {
			for (const [k, v] of Object.entries(headers) as Entries<typeof headers>) {
				headers_to_pass[k] = v;
			}
		}
		if (body) {
			if (typeof body === 'object') {
				payload = JSON.stringify(structuredClone(body));
			} else {
				payload = String(body);
			}
		}
		try {
			const RESPONSE = fetch(url, {
				method,
				headers: headers_to_pass,
				body: method === 'GET' ? null : payload === '' ? null : payload
			});
			return {
				success: true,
				original: RESPONSE
			};
		} catch (err) {
			return {
				success: false,
				reason: 'panic',
				error: err
			};
		}
	}
	/**
	 * Parse response to be read from outside functions
	 * @param resp Whatever is returned form this.#request
	 * @returns A result object. Panic<E> variant if resp.success is false (network error). 
	 * Failure<F> variant if inner Response.ok is false.
	 * ATTENTION: if received data could not be parsed to JSON, it will parse data to plain text.
	 */
	async #parse_response<Data, Fail>(
		resp: Result<Promise<Response>, never, unknown>
	): Promise<Result<Data, Fail, unknown>> {
		if (resp.success) {
			const resolved_response = await resp.original;
			if (resolved_response.ok) {
				try {
					return {
						success: true,
						original: (await resolved_response.json()) as Data
					};
				} catch {
					return {
						success: true,
						original: (await resolved_response.text()) as Data
					};
				}
			} else {
				try {
					return {
						success: false,
						reason: 'failure',
						details: (await resolved_response.json()) as Fail
					};
				} catch {
					return {
						success: false,
						reason: 'failure',
						details: (await resolved_response.text()) as Fail
					};
				}
			}
		} else {
			return resp;
		}
	}
	/**
	 * Set auto headers. Auto headers are headers that are passed automatically even if you don't pass headers parameter while requesting
	 * @param headers An object containing key value pairs of headers
	 */
	add_auto_headers(headers: Record<string, string>): void {
		for (const [k, v] of Object.entries(headers) as Entries<typeof headers>) {
			this.#auto_headers.set(k, v);
		}
	}
	/**
	 * Delete a list of auto headers
	 * @param header_names Array of names of the auto header
	 */
	remove_auto_headers(header_names: string[]): void {
		for (const name of header_names) {
			this.#auto_headers.delete(name);
		}
	}
	/**
	 * Get All the auto header names. Value of auto header is not public.
	 */
	get auto_headers(): string[] {
		const auto_headers: string[] = [];
		for (const k in this.#auto_headers.keys()) {
			auto_headers.push(k);
		}
		return auto_headers;
	}
	/**
	 * Perform get request
	 * @param path Path to get
	 * @param headers Headers to pass
	 * @returns Result object containing data returned form the server.
	 * If response is not ok (response.ok binds to false), Fail<F> variant is returned.
	 * If request could not be made due to net errors, Err<unknown is returned
	 */
	GET<Data, Fail>(
		path: string,
		headers: Record<string, string>
	): Promise<Result<Data, Fail, unknown>> {
		return this.#parse_response<Data, Fail>(this.#request(path, 'GET', headers));
	}
	/**
	 * Performs POST request
	 * @param path Path to post
	 * @param headers Headers to pass.
	 * @param body Body to include
	 * @returns Result object containing data returned form the server.
	 * If response is not ok (response.ok binds to false), Fail<F> variant is returned.
	 * If request could not be made due to net errors, Err<unknown is returned
	 */
	POST<Payload, Data, Fail>(
		path: string,
		headers: Record<string, string>,
		body: Payload
	): Promise<Result<Data, Fail, unknown>> {
		return this.#parse_response(this.#request(path, 'POST', headers, body));
	}
	/**
	 * Performs PUT request
	 * @param path Path to post
	 * @param headers Headers to pass.
	 * @param body Body to include
	 * @returns Result object containing data returned form the server.
	 * If response is not ok (response.ok binds to false), Fail<F> variant is returned.
	 * If request could not be made due to net errors, Err<unknown is returned
	 */
	PUT<Payload, Data, Fail>(
		path: string,
		headers: Record<string, string>,
		body: Payload
	): Promise<Result<Data, Fail, unknown>> {
		return this.#parse_response(this.#request(path, 'PUT', headers, body));
	}
	/**
	 * Performs DELETE request
	 * @param path Path to post
	 * @param headers Headers to pass.
	 * @param body Body to include
	 * @returns Result object containing data returned form the server.
	 * If response is not ok (response.ok binds to false), Fail<F> variant is returned.
	 * If request could not be made due to net errors, Err<unknown is returned
	 */
	DELETE<Payload, Data, Fail>(
		path: string,
		headers: Record<string, string>,
		body: Payload
	): Promise<Result<Data, Fail, unknown>> {
		return this.#parse_response(this.#request(path, 'PUT', headers, body));
	}
}
