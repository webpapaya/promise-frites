[![Build Status](https://travis-ci.org/webpapaya/promise-frites.svg?branch=master)](https://travis-ci.org/webpapaya/promise-frites)

# Promise Frites

Promise frites is a collection of utility functions to be used with es6 promises.

![Image from Wikipedia](https://raw.githubusercontent.com/webpapaya/promise-frites/master/assets/promise-frites.jpg)

## Usage

```js
import {
  ignoreReturnFor,
  rethrowError,  
  waitAtLeast,
  timeoutAfter,
  debug,
  retry,
} from 'promise-frites';

// retry
const apiCall = () => { // a brittle api call };
const retry3Times = retry(3);
Promise.resolve()
  .then(retry3Times(apiCall))
  .then((value) => console.log(value))
  .catch((error) => console.log(error));

// ignoreReturnFor
Promise.resolve()
  .then(() => '1 value')
  .then(ignoreReturnFor(() => '2 value'))
  .then((value) => value === '1 value'));
  
// rethrowError
const logError = (error) => console.error(error);
const displayErrorOnScreen = (error) => { // some magic };

Promise.resolve()
  .then(() => { throw 'something unexpected'; })
  .catch(rethrowError(logError))
  .catch(displayErrorOnScreen);
  
// waitAtLeast
const waitAtLeast1Second = waitAtLeast(1);
const apiCall = Promise.resolve('my api data');

Promise.resolve()
  .then(waitAtLeast1Second(apiCall))
  .then((data) => data === 'my api data');
  
// timeoutAfter
const timeoutAfter1Second = timeoutAfter(1);
const apiCall = () => { // a very slow api call };

Promise.resolve()
  .then(timeoutAfter1Second(apiCall))
  .catch((error) => error === 'timeout');
  
// debug
Promise.resolve()
  .then(() => 'my value')
  .then(debug)
  .then((value) => value === 'my value');
```




