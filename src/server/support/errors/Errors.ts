import { ConfigurationError } from './ConfigurationError';
import { RuntimeError } from './RuntimeError';
import { HttpError } from './HttpError';

export type Error<T> = ConfigurationError<T> | RuntimeError<T> | HttpError<T>;
export type ErrorBuilder<T> = (...args: any[]) => Error<T>;
export type Errors<T extends keyof any, R> = { [K in T]: ErrorBuilder<R> };
