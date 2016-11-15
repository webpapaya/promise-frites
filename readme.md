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
  waitAtLeast,
  timeoutAfter,
  ignoreRejectionFor,
  debug,
  retry,
  executeWhenUnresponsive,
  inBackground,
} from 'promise-frites';

// retry
const apiCall = () => { // a brittle api call };
const retry3Times = retry(3);
Promise.resolve()
  .then(retry3Times(apiCall))
  .then((value) => console.log(value))
  .catch((error) => console.log(error));
  
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
  
  
// sequence
// Executes a list of promises and waits before previous promise was resolved.
// Usefull if you want functions to be executed sequentially and hate async await loops.

const analyticsEvents = ['UserCreated', 'InvitationEmailSent', 'UserRedirectedToApp']
  .map((event) => () => { /* send events to google analytics */ }); 

Promise.resolve()
  .then(sequence(...analyticsEvents))
  .then((result) => console.log('All items have been saved.'));
  
  
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

Promise.resolve()
  .then(() => x) // ReferenceError: x is not defined
  .catch(rethrowCommonErrors(notifyUser))
  .catch(rethrowCommonErrors(logError));
```
