export const rethrowError = (fn) => (error) => Promise.resolve()
  .then(() => fn(error))
  .then(() => { throw error; });
