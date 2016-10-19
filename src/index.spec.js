import { assertThat, equalTo } from 'hamjest';
import {
  delay,
  ignoreReturnFor,
  rethrowError,
  waitAtLeastSeconds,
  parallel,
  timeoutAfter,
} from './index';

describe('ignoreReturnFor', () => {
  it('ignores return value', () => Promise.resolve()
    .then(() => '1 value')
    .then(ignoreReturnFor(() => '2 value'))
    .then((value) =>
      assertThat(value, equalTo('1 value'))));
});

describe('rethrowError', () => {
  it('ignores return value', () => Promise.resolve()
    .then(() => { throw 'my error'; })
    .catch(rethrowError((error) => error))
    .then(() => assertThat(false, equalTo(true)))
    .catch((error) =>
      assertThat(error, equalTo('my error'))));
});

describe('waitAtLeast', () => {
  it('waits at least 15ms', () => {
    const startTime = +new Date();
    return Promise.resolve()
      .then(waitAtLeastSeconds(0.015)(() => {}))
      .then(() => {
        const timeDifference = new Date() - startTime;
        assertThat(timeDifference >= 10, equalTo(true));
      });
  });
});

describe('parallel', () => {
  it('executes code blocks in parallel', () => {
    return Promise.resolve()
      .then(parallel(
        () => 'promise 1',
        () => Promise.resolve('promise 2')
      ))
      .then(([promise1, promise2]) => {
        assertThat(promise1, equalTo(promise1));
        assertThat(promise2, equalTo(promise2));
      });
  });
});

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
        .then((result) => assertThat(result, equalTo('success')))
        .catch((error) => assertThat(false, equalTo(true)));
    });

    it('AND promise is passed in', () => {
      const timeoutFast = timeoutAfter(0.01);
      return Promise.resolve()
        .then(timeoutFast(() => Promise.resolve('success')))
        .then((result) => assertThat(result, equalTo('success')))
        .catch((error) => assertThat(false, equalTo(true)));
    });
  });
});





