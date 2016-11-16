import { assertThat, greaterThanOrEqualTo } from 'hamjest';
import { waitAtLeastSeconds } from './index';

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
