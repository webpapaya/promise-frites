import curry from "./curry";

/**
 * Inverts a promise.
 * Resolved will be converted to rejected.
 * Rejected will be converted to resolved.
 *
 * @example
 *
 * const callWeiredApi = (args) => Promise.resolve()
 *  .then(invert(() => fetch('something/weired'));
 */
export const invert = curry((fn, args) => Promise.resolve()
  .then(() => fn(args))
  .then(
    (value) => { throw value },
    (error) => error,
  ));
