import type { QueryType } from '#types';
declare global {
	namespace Express {
		export interface Request {
			sanitizedQuery?: QueryType;
		}
	}
}

export {};
