import ConfigurationError from './ConfigurationError';
import RuntimeError from './RuntimeError';
import HttpError from './HttpError';

type Errors<T extends keyof any> = { [K in T]: ConfigurationError | RuntimeError | HttpError };

export default Errors;
