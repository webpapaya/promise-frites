const _queue = (args = [], ...fns) => {
  if (fns.length === 0) { return args; }
  const [currentFn, ...rest] = fns;
  return Promise.resolve()
    .then(() => currentFn(args))
    .then((newArg) => _queue([...args, newArg], ...rest));
};

/**
 * Executes a list of promises and waits before previous promise was resolved.
 * In difference to sequence, queue responds an array containing all resolved values.
 *
 * @param {array} fns, functions to be executed
 * @example
 *
 * const analyticsEvents = ['UserCreated', 'InvitationEmailSent']
 *   .map((event) => () => { 'send a single event to google analytics' });
 *
 * Promise.resolve()
 *   .then(queue(...analyticsEvents))
 *   .then(([responseOfUserCreated, responseOfInvitationEmailSent]) =>
 *     console.log('All events have been stored.'));
 */
export const queue = (...fns) => () => _queue(void 0, ...fns);

