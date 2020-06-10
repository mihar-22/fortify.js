import { ConfigurationError } from './ConfigurationError';
import { RuntimeError } from './RuntimeError';
import { HttpError } from './HttpError';

export type Error = ConfigurationError | RuntimeError | HttpError;

export type ErrorBuilder<ContextType> = (context?: ContextType) => Error;

export type ErrorContextRecord<ErrorEnumCode extends keyof any> = {
  [P in ErrorEnumCode]: object
};

export type ErrorBuilderRecord<
  ErrorCodeEnum extends keyof any,
  ErrorContextRecordType extends ErrorContextRecord<ErrorCodeEnum>,
> = {
  [P in keyof ErrorContextRecordType]: ErrorBuilder<ErrorContextRecordType[P]>
};
