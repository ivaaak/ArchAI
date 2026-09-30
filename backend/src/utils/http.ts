import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ObjectId } from 'mongodb';

export class HttpError extends Error {
    constructor(public status: number, message: string) {
        super(message);
    }
}

// Express 4 does not forward rejected promises to the error handler, so wrap async handlers.
export const asyncHandler = (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler => (req, res, next) => {
    handler(req, res, next).catch(next);
};

export function parseObjectId(id: string): ObjectId {
    if (!ObjectId.isValid(id)) {
        throw new HttpError(400, `Invalid id: ${id}`);
    }
    return new ObjectId(id);
}

export function requireCollection<T>(collection: T | undefined): T {
    if (!collection) {
        throw new HttpError(503, 'Database is not connected');
    }
    return collection;
}

// Removes fields that must never be written by clients (e.g. the immutable _id).
export function withoutId<T extends object>(body: T): Omit<T, '_id'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = body as T & { _id?: unknown };
    return rest;
}
