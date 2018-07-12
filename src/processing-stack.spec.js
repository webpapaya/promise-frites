import { assertThat, equalTo } from 'hamjest';
import { createProcessingStack } from './processing-stack';

describe('processingStack', () => {
  it('executes all enqued items', (done) => {
    let callCount = 0;
    const enqueue = createProcessingStack();
    enqueue(() => { callCount += 1; return Promise.resolve(); });
    enqueue(() => { callCount += 1; return Promise.resolve(); });
    enqueue(() => {
      assertThat(callCount, equalTo(2));
      done();
    });
  });
});
