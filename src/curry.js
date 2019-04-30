const curry = (fn) => {
  const arity = fn.length
  const curriedFn = (...args) => args.length < arity
    ? curriedFn.bind(null, ...args)
    : fn.call(null, ...args);

  return curriedFn;
}

export default curry;