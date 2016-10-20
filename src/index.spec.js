import { assertThat, equalTo, greaterThanOrEqualTo } from 'hamjest';
import {
  delay,
  ignoreReturnFor,
  rethrowError,
  waitAtLeastSeconds,
  parallel,
  timeoutAfter,
  retry,
  ignoreRejectionFor
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
    .then(() => { throw new Error('my error'); })
    .catch(rethrowError((error) => error))
    .then(() => assertThat(false, equalTo(true)))
    .catch((error) =>
      assertThat(error.message, equalTo('my error'))));
});

describe('waitAtLeast', () => {
  it('waits at least 15ms', () => {
    const startTime = +new Date();
    return Promise.resolve()
      .then(waitAtLeastSeconds(0.015)(() => {}))
      .then(() => {
        const timeDifference = new Date() - startTime;
        assertThat(timeDifference, greaterThanOrEqualTo(14));
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
        .catch(() => assertThat(false, equalTo(true)));
    });

    it('AND promise is passed in', () => {
      const timeoutFast = timeoutAfter(0.01);
      return Promise.resolve()
        .then(timeoutFast(() => Promise.resolve('success')))
        .then((result) => assertThat(result, equalTo('success')))
        .catch(() => assertThat(false, equalTo(true)));
    });
  });
});

describe('retry', () => {
  const createBrittleApi = (resolveOnNthTime) => {
    let retries = 0;
    return () => {
      retries += 1;
      return retries === resolveOnNthTime
        ? Promise.resolve('success')
        : Promise.reject('error');
    };
  };

  it('retries 3 times', () => {
    const apiCall = createBrittleApi(3);
    const retry3Times = retry(3);
    return Promise.resolve()
      .then(retry3Times(apiCall))
      .then((value) => assertThat(value, equalTo('success')));
  });

  it('fails when promise couldn\'t be resolved', () => {
    const apiCall = createBrittleApi(4);
    const retry3Times = retry(3);
    return Promise.resolve()
      .then(retry3Times(apiCall))
      .catch(({ message }) =>
        assertThat(message, equalTo('Couldn\'t resolve promise after 3 retries.')));
  });
});


describe('ignoreRejectionFor', () => {
  it('a rejections is ignored', () => {
    const logToRemote = () => Promise.reject('Api Error');
    return Promise.resolve()
      .then(ignoreRejectionFor(logToRemote))
      .then((value) => assertThat(value, equalTo('Api Error')))
      .catch(() => { throw new Error('Promise shouln\'t be rejected'); });
  });

  it('works on a resolved promise as well', () => {
    const logToRemote = () => Promise.resolve('Api Success');
    return Promise.resolve()
      .then(ignoreRejectionFor(logToRemote))
      .then((value) => assertThat(value, equalTo('Api Success')))
      .catch(() => { throw new Error('Promise shouln\'t be rejected'); });
  });
});


