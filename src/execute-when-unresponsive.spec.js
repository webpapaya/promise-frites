import { assertThat, equalTo } from 'hamjest';
import { executeWhenUnresponsive } from './index';

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
