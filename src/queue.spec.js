import { assertThat, equalTo } from 'hamjest';

const _queue = (args = [], ...fns) => {
  if (fns.length === 0) { return args; }
  const [currentFn, ...rest] = fns;
  return Promise.resolve()
    .then(() => currentFn(args))
    .then((newArg) => _queue([...args, newArg], ...rest));
};

export const queue = (...fns) => _queue(void 0, ...fns);


describe('queue', () => {
  it('calls given fns sequentially', () => {
    let secondWasCalled = false;
    return queue(
      () => assertThat(secondWasCalled, equalTo(false)),
      () => { secondWasCalled = true; },
    );
  });

  it('AND passes arguments to the next fn', () => {
    return queue(
      () => 'first argument',
      () => 'second argument',
      (myArgument) => assertThat(myArgument, equalTo(['first argument', 'second argument'])),
    );
  });

  it('AND responds all arguments on resolve', () => {
    return queue(
      () => 'first',
      () => 'second',
      () => 'third',
    ).then((myArgument) => assertThat(myArgument, equalTo(['first', 'second', 'third'])));
  });
});
