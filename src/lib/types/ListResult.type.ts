import type DefaultFields from './DefaultFields.type';
export default interface ListResult<R extends Record<string, unknown>> {
	page: number;
	perPage: number;
	totalItems: number;
	totalPages: number;
	items: Partial<DefaultFields & R>[];
}
