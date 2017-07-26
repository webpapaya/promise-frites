[![Build Status](https://travis-ci.org/webpapaya/promise-frites.svg?branch=master)](https://travis-ci.org/webpapaya/promise-frites)

# Promise Frites

Promise frites is a collection of utility functions to be used with es6 promises.

![Image from Wikipedia](https://raw.githubusercontent.com/webpapaya/promise-frites/master/assets/promise-frites.jpg)

## Installation
```
npm install promise-frites --save
```

## Usage
```js
import {
  ignoreReturnFor,
  rethrowError,  
  waitAtLeastSeconds,
  timeoutAfter,
  ignoreRejectionFor,
  debug,
  retry,
  executeWhenUnresponsive,
  inBackground,
} from 'promise-frites';

// executeWhenUnresponsive
const shortDelay = 0.5; // seconds
const notifyUserOnLongRequest = executeWhenUnresponsive({
  [shortDelay]: () => { console.log('Hold on!'); },
  [shortDelay * 2]: () => { console.log('Almost there!'); },
  [shortDelay * 10]: () => { console.log('For some reason this takes some time!'); },
  finally: () => { console.log('We made it'); }, // might be used as a teardown fn.
});

const apiCall = () => { /* an api call which might take some time */ };
Promise.resolve()
  .then(notifyUserOnLongRequest(apiCall))
  .then((result) => console.log(`API call responded ${result}`));

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
  
// timeoutAfter
const timeoutAfter1Second = timeoutAfter(1);
const apiCall = () => { // a very slow api call };

Promise.resolve()
  .then(timeoutAfter1Second(apiCall))
  .catch((error) => error === 'timeout');
  
// ignoreRejectionFor
const logToRemote = () => Promise.reject('Api Error');
Promise.resolve()
  .then(ignoreRejectionFor(logToRemote))
  .then((value) => assertThat(value, equalTo('Api Error')));

// debug
Promise.resolve()
  .then(() => 'my value')
  .then(debug)
  .then((value) => value === 'my value');
  
// inBackground
const longRunningPromise = () => { // do something fancy };
Promise.resolve()
  .then(inBackground(longRunningPromise))
  .then(() => console.log('I won\'t wait for longRunningPromise'));
  
// queue

  
// rethrowIfOneOf (factory function)
const rethrowMyErrors = rethrowIfOneOf(MyCustomError1, MyCustomError2);
const logError = () => {};
const notifyUser = () => {};

Promise.resolve()
  .then(myBrokenFunction)
  .catch(rethrowMyErrors(notifyUser))
  .catch(logError);
  
  
// rethrowCommonErrors
// Rethrows errors which shouldn\'t make it to production eg: `SyntaxError`, `TypeError`, ...


```
