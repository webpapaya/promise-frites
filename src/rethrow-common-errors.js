const COMMON_ERRORS = [
  ReferenceError,
  TypeError,
  EvalError,
  RangeError,
  SyntaxError,
  URIError
];

const throwIfInstanceOf = (error, errorClass) => {
  if (error instanceof errorClass) { throw error; }
};

export const rethrowCommonErrors = (fn) => (error) => Promise.resolve()
  .then(() => fn(error))
  .then(() => COMMON_ERRORS.forEach((errorClass) =>
    throwIfInstanceOf(error, errorClass)));
