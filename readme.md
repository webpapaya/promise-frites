[![Build Status](https://travis-ci.org/webpapaya/promise-frites.svg?branch=master)](https://travis-ci.org/webpapaya/promise-frites)

# Promise Frites

Promise frites is a collection of utility functions to be used with es6 promises.

![Image from Wikipedia](https://raw.githubusercontent.com/webpapaya/promise-frites/master/assets/promise-frites.jpg)

## Installation
```
npm install promise-frites --save
```

## Usage

Please have a look at the [docs.](https://github.com/webpapaya/promise-frites/blob/master/doc.md)

## Breaking change in v1.0.0

Retry does not return the last error, but throws a RetryError which contains all errors under the `errors` property.


