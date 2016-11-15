const throwIfInstanceOf = (error, errorClass) => {
  if (error instanceof errorClass) { throw error; }
};

export const rethrowIfOneOf = (...errors) => (fn) => (error) => Promise.resolve()
  .then(() => fn(error))
  .then(() => errors.forEach((errorClass) =>
    throwIfInstanceOf(error, errorClass)));

