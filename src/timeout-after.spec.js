import { assertThat, equalTo } from 'hamjest';
import { timeoutAfter, delay } from './index';

describe('timeoutAfter', () => {
  it('throws after 10ms', () => {
    const timeoutFast = timeoutAfter(0.01);
    const longRunningPromise = () => delay(0.1);

    return Promise.resolve()
      .then(timeoutFast(longRunningPromise))
      .then(() => assertThat(false, equalTo(true)))
      .catch((error) => assertThat(error, equalTo('timeout')));
  });

  describe('succeeds if timeout isn\'t reached', () => {
    it('AND normal function is passed in', () => {
      const timeoutFast = timeoutAfter(0.01);
      return Promise.resolve()
        .then(timeoutFast(() => 'success'))
        .then((result) => assertThat(result, equalTo('success')));
    });

    it('AND promise is passed in', () => {
      const timeoutFast = timeoutAfter(0.01);
      return Promise.resolve()
        .then(timeoutFast(() => Promise.resolve('success')))
        .then((result) => assertThat(result, equalTo('success')));
    });

    it('ensure promise is never resolved twice', () => {
      let wasCalled = 0;
      const timeoutFast = timeoutAfter(0.01);
      const longRunningPromise = () => delay(0.02);

      Promise.resolve()
        .then(timeoutFast(longRunningPromise))
        .then(() => { wasCalled += 1; })
        .catch(() => { wasCalled += 1; });

      return delay(0.05)
        .then(() => assertThat(wasCalled, equalTo(1)));
    });
  });
});
