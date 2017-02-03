# elemental-live-client

[![Build Status](https://travis-ci.org/NYTimes/elemental-live-client.svg?branch=master)](https://travis-ci.org/NYTimes/elemental-live-client)
[![codecov](https://codecov.io/gh/NYTimes/elemental-live-client/branch/master/graph/badge.svg)](https://codecov.io/gh/NYTimes/elemental-live-client)

JS library to communicate with Elemental live API.

## Usage

The client provides standard methods for resources, so calls will use be
structured in the format ``<client-instance>.<resource>().<operation>()``.

API operations always return promises that resolve with the response data and
fail with details about the failure. An example, listing presets:

```javascript
const client = new ElementalClient('https://elemental-server.example.com');

client.presets().list().then(
  (data) => console.log(`Got presets: ${data}`),
  (err) => console.log(`Something went wrong: ${err}`),
);
```

### Available resources

The following resources are currently available:

* ``schedules``
* ``liveEvents``
* ``liveEventProfiles``
* ``presets``
* ``presetCategories``

### Available operations

Common operations are:

* ``create``
* ``retrieve``
* ``update``
* ``delete``
* ``list``

Some resource might include more specific operations (for example, resetting a
live event).
