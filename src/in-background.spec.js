import { assertThat, equalTo } from 'hamjest';
import { inBackground, delay } from './index';

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
