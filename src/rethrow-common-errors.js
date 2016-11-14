import { rethrowIfOneOf } from './rethrow-if-one-of';

export const rethrowCommonErrors = rethrowIfOneOf(
  ReferenceError,
  TypeError,
  EvalError,
  RangeError,
  SyntaxError,
  URIError
);
