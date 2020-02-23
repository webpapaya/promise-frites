import { assertThat, equalTo } from 'hamjest';
import { retry } from './index';

describe('retry', () => {
  const createBrittleApi = (resolveOnNthTime) => {
    let retries = 0;
    return () => {
      retries += 1;
      return retries === resolveOnNthTime
        ? Promise.resolve('success')
        : Promise.reject(`error ${retries}`);
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
      .catch((error) =>
        assertThat(error.errors, equalTo([
          'error 1',
          'error 2',
          'error 3',
        ])));
  });
});
