import { type RequestHandler } from 'express';
import { z, type ZodObject } from 'zod/v4';

type ValidationOptions = 'body' | 'params' | 'query';

const validateZod = (
	zodSchema: ZodObject,
	property: ValidationOptions
): RequestHandler => {
	return (req, res, next) => {
		if (!req[property])
			next(
				new Error(`Missing ${property} in request`, { cause: { status: 400 } })
			);

		const { data, error, success } = zodSchema.safeParse(req[property]);
		if (!success) {
			next(new Error(z.prettifyError(error), { cause: { status: 400 } }));
		} else {
			if (property === 'query') {
				req.sanitizedQuery = data;
			} else {
				req[property] = data;
			}
			next();
		}
	};
};

export default validateZod;
