import { assertThat, equalTo } from 'hamjest';
import { rethrowError } from './index';

describe('rethrowError', () => {
  it('ignores return value', () => Promise.resolve()
    .then(() => { throw new Error('my error'); })
    .catch(rethrowError((error) => error))
    .then(() => assertThat(false, equalTo(true)))
    .catch((error) =>
      assertThat(error.message, equalTo('my error'))));
});
