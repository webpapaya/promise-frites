/**
 * Executes all functions in parallel. (Simple wrapper around Promise.all)
 *
 * @param fns, a list of functions to be executed in parallel
 */
export const parallel = (...fns) => () =>
  Promise.all(fns.map((fn) => fn()));
