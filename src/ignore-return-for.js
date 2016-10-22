export const ignoreReturnFor = (fn) => (arg) => Promise.resolve()
  .then(() => fn(arg))
  .then(() => arg);
