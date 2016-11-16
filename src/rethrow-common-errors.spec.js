import { assertThat, instanceOf, equalTo } from 'hamjest';
import { rethrowCommonErrors } from './index';

describe('rethrowCommonErrors', () => {
  it('rethrows ReferenceError', () => {
    return Promise.resolve()
      .then(() => x) // eslint-disable-line no-undef
      .catch(rethrowCommonErrors(() => {}))
      .then(() => assertThat(false, equalTo(true)))
      .catch((error) => assertThat(error, instanceOf(ReferenceError)));
  });

  it('rethrows TypeError', () => {
    return Promise.resolve()
      .then(() => (void 0).test)
      .catch(rethrowCommonErrors(() => {}))
      .then(() => assertThat(false, equalTo(true)))
      .catch((error) => assertThat(error, instanceOf(TypeError)));
  });

  it('doesn\'t rethrow custom error', () => {
    return Promise.resolve()
      .then(() => { throw new Error('test'); })
      .catch(rethrowCommonErrors(() => {}));
  });
});

