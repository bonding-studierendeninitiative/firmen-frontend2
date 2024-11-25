export type TupleResult<T> = [Error] | [null, T];

async function tuple<T>(maybePromise: Promise<T>): Promise<TupleResult<T>> {
	try {
		return [null, await maybePromise];
	} catch (error) {
		if (error instanceof Error) {
			return [error];
		}
		return [new TupleItError(error)];
	}
}

class TupleItError extends Error {
	error: unknown;

	constructor(error: unknown) {
		super('Promise rejected with a non-instance of Error');
		this.error = error;
	}
}

export { TupleItError, tuple as t };
