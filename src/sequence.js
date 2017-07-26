const _sequence = (...fns) =>
  fns.reduce((promises, currentPromise) => promises.then(currentPromise), Promise.resolve());

/**
 * Executes a list of promises and waits before previous promise was resolved.
 * Usefull if you want functions to be executed sequentially and hate async await loops.
 * In difference to queue, sequence responds a single value (the one from the last function in the chain).
 * @param {array} fns, Array of functions
 * @example
 * import { sequence } from 'promise-frites';
 * const analyticsEvents = ['UserCreated', 'InvitationEmailSent', 'UserRedirectedToApp']
 *  .map((event) => () => { 'send a single event to google analytics' });
 *
 * Promise.resolve()
 *   .then(sequence(...analyticsEvents))
 *   .then((userRedirectedToAppResult) => console.log('All items have been saved.'));
 */
export const sequence = (...fns) => () => _sequence(void 0, ...fns);
