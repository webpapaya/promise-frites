import deprecate from './deprecate';
/**
 * Executes all functions in parallel. (Simple wrapper around Promise.all)
 *
 * @param fns, a list of functions to be executed in parallel
 */
export const parallel = (...fns) => () => {
  deprecate(`
    In the next major version parallel will be replaced by parallelObject.
    This means that parallel will accept an array as first argument instead
    of a list of arguments.
    parallel(() => Promise.resolve(1), () => Promise.resolve(2))
    needs to be replaced by
    parallel([() => Promise.resolve(1), () => Promise.resolve(2)])
  `);

  return Promise.all(fns.map((fn) => fn()));
};

