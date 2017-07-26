import { ignoreReturnFor } from './index';

/**
 * Logs the current value of a promise chain to the console and continues with the chain.
 * @example
 * import { debug } from 'promise-frites';
 *
 * Promise.resolve()
 *  .then(() => 'my value')
 *  .then(debug) // Logs to 'my value' console
 *  .then((value) => value === 'my value');
 */
export const debug = ignoreReturnFor((arg) => console.log(arg)); // eslint-disable-line  no-console
