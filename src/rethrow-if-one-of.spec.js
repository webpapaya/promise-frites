import { assertThat, instanceOf, equalTo } from 'hamjest';
import { rethrowIfOneOf } from './index';

describe('rethrowIfOneOf', () => {
  it('rethrows ReferenceError', () => {
    const rethrowCustomErrors = rethrowIfOneOf(ReferenceError, TypeError);

    return Promise.resolve()
      .then(() => x) // eslint-disable-line no-undef
      .catch(rethrowCustomErrors(() => {}))
      .then(() => assertThat(false, equalTo(true)))
      .catch((error) => assertThat(error, instanceOf(ReferenceError)));
  });
});
