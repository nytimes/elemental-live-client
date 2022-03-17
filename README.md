# elemental-live-client

[![Build Status](https://travis-ci.org/nytimes/elemental-live-client.svg?branch=main)](https://travis-ci.org/nytimes/elemental-live-client)
[![codecov](https://codecov.io/gh/nytimes/elemental-live-client/branch/main/graph/badge.svg)](https://codecov.io/gh/nytimes/elemental-live-client)

JS library to communicate with Elemental live API.

## Usage

The client provides standard methods for resources, so calls will use be
structured in the format ``<client-instance>.<resource>().<operation>()``.

First, initialize the client. Optionally, provide any extra headers to add to
requests. Note, adding a version string is optional but instructs the client
to use that version in requests to the API.

```javascript
const client = new ElementalClient('https://elemental-server.example.com');
```

or

```javascript
const client = new ElementalClient('https://elemental-server.example.com', { 'X-API-Key': 'anApiKey' },'v2.15.3.0');
```

API operations always return promises that resolve with the response data and
fail with details about the failure. An example, listing presets:

```javascript
client.presets().list()
  .then((data) => console.log(`Got presets: ${data}`))
  .catch((err) => console.log(`Something went wrong: ${err}`));
```

### Available resources

The following resources are currently available:

* ``schedules``
* ``liveEvents``
* ``liveEventProfiles``
* ``presets``
* ``presetCategories``
* ``devices``

### Available operations

Common operations are:

* ``create``
* ``retrieve``
* ``update``
* ``delete``
* ``list``

Some resources might include more specific operations (for example, resetting a
live event).

## Contributing

Contributions are welcome! In order to run this project locally, you have to
have node.js 6+ installed locally.

Just make sure your contributions pass the test suite and eslint validation.
[Travis CI](https://travis-ci.org/NYTimes/elemental-live-client/) will help you
in ensuring that :)

### Setting up local environment

Setting up the local environment is a simple task: just ensure that you have
node.js and npm installed, clone this repo and then run:

```
% npm install
```

This will install all dependencies.

### Running tests and eslint

After installing all dependencies, you can run the tests with the command:

```
% npm run test
```

linting is also available, provided by eslint. The command to lint the source
is very intuitive:

```
% npm run lint
```

## Integration tests/Examples

You can integration tests in the file
[test/integration-test.js](https://github.com/NYTimes/elemental-live-client/blob/main/test/integration-test.js)
file. It contains integration tests that can also serve as examples on how to
use the client.

To run integration tests locally, you need to provide the address of an actual
Elemental server through the environment variable
``ELEMENTAL_CLIENT_INTEGRATION_TESTS_HOST`` and run ``npm run test``. For example:

```
% ELEMENTAL_CLIENT_INTEGRATION_TESTS_HOST=http://elemental-live.example.com npm run test
```
