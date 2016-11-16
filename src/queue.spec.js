import { assertThat, equalTo } from 'hamjest';
import { queue } from './index';

describe('queue', () => {
  it('calls given fns sequentially', () => {
    let secondWasCalled = false;
    return Promise.resolve()
      .then(() => queue(
        () => assertThat(secondWasCalled, equalTo(false)),
        () => { secondWasCalled = true; },
      ));
  });

  it('AND passes return value to the next fn', () => {
    return Promise.resolve()
      .then(queue(
        () => 'first argument',
        () => 'second argument',
        (myArgument) => assertThat(myArgument, equalTo(['first argument', 'second argument'])),
      ));
  });

  it('AND responds all return values on resolve', () => Promise.resolve()
    .then(queue(
      () => 'first',
      () => 'second',
      () => 'third',
    ))
    .then((myArgument) => assertThat(myArgument, equalTo(['first', 'second', 'third']))));

  it('AND doesn\'t execute remaining items if one throws', () => {
    let thirdWasCalled = false;
    return Promise.resolve()
      .then(queue(
        () => 'first',
        () => { throw new Error() },
        () => { thirdWasCalled = true },
      ))
      .catch(() => assertThat(thirdWasCalled, equalTo(false)));
  });
});
