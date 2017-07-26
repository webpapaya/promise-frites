import { rethrowIfOneOf } from './rethrow-if-one-of';

/**
 * Rethrows common errors like SyntaxError or ReferenceError.
 * @param {function} fn, a promise
 * @example
 * import { rethrowCommonErrors } from 'promise-frites';
 *
 * Promise.resolve()
 *   .then(() => x) // ReferenceError: x is not defined
 *   .catch(rethrowCommonErrors(notifyUser))
 *   .catch(rethrowCommonErrors(logError));
 */
export const rethrowCommonErrors = rethrowIfOneOf(
  ReferenceError,
  TypeError,
  EvalError,
  RangeError,
  SyntaxError,
  URIError
);
