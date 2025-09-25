declare global {
	namespace Express {
		export interface Request {
			sanitizedQuery?: { owner: string };
		}
	}
}

export {};
