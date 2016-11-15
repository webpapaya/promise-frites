import { assertThat, equalTo, greaterThanOrEqualTo } from 'hamjest';
import {
  delay,
  ignoreReturnFor,
  rethrowError,
  waitAtLeastSeconds,
  parallel,
  timeoutAfter,
  retry,
  ignoreRejectionFor,
  executeWhenUnresponsive,
  inBackground,
  sequence,
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

describe('executeWhenUnresponsive', () => {
  it('executes finally before promise is resolved', () => {
    let fnAfter10msWasCalled = false;
    let finallyWasCalled = false;

    const displayErrors = executeWhenUnresponsive({
      0.01: () => { fnAfter10msWasCalled = true; },
      finally: () => { finallyWasCalled = true; },
    });

    const longLastingPromise = () => new Promise((resolve) => setTimeout(resolve, 30));

    return Promise.resolve()
      .then(displayErrors(longLastingPromise))
      .then(() => {
        assertThat(fnAfter10msWasCalled, equalTo(true));
        assertThat(finallyWasCalled, equalTo(true));
      });
  });

  it('executes finally even though the promise resolves immediately', () => {
    let finallyWasCalled = false;
    let fnAfter10msWasCalled = false;

    const displayErrors = executeWhenUnresponsive({
      0.01: () => { fnAfter10msWasCalled = true; },
      finally: () => { finallyWasCalled = true; },
    });

    const longLastingPromise = () => Promise.resolve();

    return Promise.resolve()
      .then(displayErrors(longLastingPromise))
      .then(() => {
        assertThat(fnAfter10msWasCalled, equalTo(false));
        assertThat(finallyWasCalled, equalTo(true));
      });
  });

  it('executes given functions', () => {
    let fnAfter10msWasCalled = false;
    let fnAfter20msWasCalled = false;

    const displayErrors = executeWhenUnresponsive({
      0.01: () => { fnAfter10msWasCalled = true; },
      0.02: () => { fnAfter20msWasCalled = true; },
    });

    const longLastingPromise = () => new Promise((resolve) => setTimeout(resolve, 30));

    return Promise.resolve()
      .then(displayErrors(longLastingPromise))
      .then(() => {
        assertThat(fnAfter10msWasCalled, equalTo(true));
        assertThat(fnAfter20msWasCalled, equalTo(true));
      });
  });

  it('doesn\'t execute fn when promise is resolved fast', () => {
    let fnAfter10msWasCalled = false;

    const displayErrors = executeWhenUnresponsive({
      0.02: () => { fnAfter10msWasCalled = true; },
    });

    const longLastingPromise = () =>
      new Promise((resolve) => setTimeout(() => resolve('Success'), 10));

    return Promise.resolve()
      .then(displayErrors(longLastingPromise))
      .then((message) => {
        assertThat(message, equalTo('Success'));
        assertThat(fnAfter10msWasCalled, equalTo(false));
      });
  });

  it('doesn\'t execute fn when promise is rejected fast', () => {
    let fnAfter10msWasCalled = false;

    const displayErrors = executeWhenUnresponsive({
      0.2: () => { fnAfter10msWasCalled = true; },
    });

    const longLastingPromise = () =>
      new Promise((_resolve, reject) => setTimeout(() => reject('Error'), 10));

    return Promise.resolve()
      .then(displayErrors(longLastingPromise))
      .then(() => assertThat(false, equalTo(true)))
      .catch((error) => {
        assertThat(error, equalTo('Error'));
        assertThat(fnAfter10msWasCalled, equalTo(false));
      });
  });

  it('waits until all schedules are resolved before resolving promise', () => {
    const callOrder = [];

    const longLastingPromise = () =>
      new Promise((resolve) => setTimeout(resolve, 30));

    const displayErrors = executeWhenUnresponsive({
      0.01: () => longLastingPromise().then(() => { callOrder.push('errorFn'); }),
    });

    const apiCall = () => longLastingPromise();
    return Promise.resolve()
      .then(displayErrors(apiCall))
      .then(() => callOrder.push('apiCall'))
      .then(() => {
        assertThat(callOrder[0], equalTo('errorFn'));
        assertThat(callOrder[1], equalTo('apiCall'));
      });
  });
});

describe('inBackround', () => {
  it('doesn\'t wait for the promise to resolve', () => {
    let wasCalled = false;
    const myLongRunningApiCall = () => Promise.resolve()
      .then(() => delay(0.02))
      .then(() => { wasCalled = true; });

    return Promise.resolve()
      .then(inBackground(myLongRunningApiCall))
      .then(() => assertThat(wasCalled, equalTo(false)));
  });
});

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
});
