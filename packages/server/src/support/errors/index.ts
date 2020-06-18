import { ConfigurationError } from './ConfigurationError';
import { RuntimeError } from './RuntimeError';
import { HttpError } from './HttpError';

export * from './HttpError';
export * from './RuntimeError';
export * from './ConfigurationError';
export * from './DependenciesMissingError';
export * from './ServerError';

export type Error = ConfigurationError | RuntimeError | HttpError;
