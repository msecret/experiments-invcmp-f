# stockarator

[![Build Status](https://travis-ci.org/msecret/experiments-invcmp-f.svg?branch=master)](https://travis-ci.org/msecret/experiments-invcmp-f)

version 0.0.4

## About
An experimental UI for a simple spreadsheet program for comparing various 
stock market investments. Used by myself. This repository is only the front
end of the app.

### Functionality
- Add new stock market symbols with up to date data from Yahoo Finnance.
- Update specific fields of data for each symbol.
- Cluster symbols by groups.

## Installation

```
npm install & bower install
```


## Static file server

The watch task serves the contents of the 'app' directory on
`http://localhost:8080/`, and watches files for changes. Install Chrome's
[LiveReload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
to have the browser tab automatically refresh when files are changed.

```
npm run watch
```

Alternatively, the server (which is a local installation of
[node-static](https://github.com/cloudhead/node-static/)) and can be run on its
own:

```
npm run server
```

Additional tasks can be included in the `gulpfile.js`. For further information
about using Gulp, please refer to the [Gulp website](http://gulpjs.com/).


## Unit tests

A local installation of Karma is used to run the JavaScript unit tests.
Karma makes it easy to watch files and run unit tests in real browsers:

```
npm run watch-test
```

```
npm test
```

