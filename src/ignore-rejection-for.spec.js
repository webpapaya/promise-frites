import { assertThat, equalTo } from 'hamjest';
import { ignoreRejectionFor } from './index';

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
