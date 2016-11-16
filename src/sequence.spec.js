import { assertThat, equalTo } from 'hamjest';
import { sequence } from './index';

describe('sequence', () => {
  it('calls given fns sequentially', () => {
    let secondWasCalled = false;
    return sequence(
      () => assertThat(secondWasCalled, equalTo(false)),
      () => { secondWasCalled = true; },
    );
  });

  it('AND passes arguments to the next fn', () => {
    return sequence(
      () => 'my argument',
      (myArgument) => assertThat(myArgument, equalTo('my argument')),
    );
  });

  it('AND returns last argument in chain', () => {
    return sequence(
      () => 'my argument',
    ).then((myArgument) => assertThat(myArgument, equalTo('my argument')));
  });
});
