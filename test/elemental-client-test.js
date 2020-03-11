const assert = require('chai').assert;
const xmlEventList = require('./data-test');

const Device = require('../lib/device').Device;
const ElementalClient = require('../lib/main').ElementalClient;
const LiveEvent = require('../lib/live-event').LiveEvent;
const Resource = require('../lib/resource').Resource;

describe('ElementalClient', () => {
  it('sendRequest should support "data-less" requests and resolve promise on response', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const eventList = [{name: 'Live event 1'}, {name: 'Live event 2'}];

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'GET',
        url: '/api/live_events',
        qs: {'page': '3', 'per_page': 30},
        headers: {},
        body: null,
      });
      callback(null, {statusCode: 200, headers: {}}, eventList);
    };

    return client.sendRequest('GET', '/live_events', {page: '3', 'per_page': 30}, null).
      then((data) => {
        assert.deepEqual(data, eventList);
      });
  });

  it('sendRequest should send raw-data if content-type is declared', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const eventList = {'live_event_list': {
      'live_event': [
        {
          '$': {href: '/live_events/1'},
          name: 'Event 1',
          input: {name: 'input_1'},
        },
        {
          '$': {href: '/live_events/2'},
          name: 'Event 2',
          input: {name: 'input_1'},
        },
      ],
    }};

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'POST',
        url: '/api/live_events',
        qs: null,
        headers: {'Content-Type': 'text/plain'},
        body: 'some nice data',
      });
      callback(null, {statusCode: 200, headers: {'content-type': 'application/xml'}}, xmlEventList);
    };

    return client.sendRequest('POST', '/live_events', null, 'some nice data', {'Content-Type': 'text/plain'}).then(
      (data) => {
        assert.deepEqual(data, eventList);
      }
    );
  });

  it('sendRequest should send data and resolve promise with parsed data on response', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const eventList = {'live_event_list': {
      'live_event': [
        {
          '$': {href: '/live_events/1'},
          name: 'Event 1',
          input: {name: 'input_1'},
        },
        {
          '$': {href: '/live_events/2'},
          name: 'Event 2',
          input: {name: 'input_1'},
        },
      ],
    }};

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'POST',
        url: '/api/live_events',
        qs: null,
        headers: {'Content-Type': 'application/xml'},
        body: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><name>My live event!</name>',
      });
      callback(null, {statusCode: 200, headers: {'content-type': 'application/xml'}}, xmlEventList);
    };

    return client.sendRequest('POST', '/live_events', null, {name: 'My live event!'}).then(
      (data) => {
        assert.deepEqual(data, eventList);
      }
    );
  });

  it('sendRequest should not include version number in GET requests', () => {
    const client = new ElementalClient('http://my-elemental-server', null, 'v2.17.3.0');
    const eventList = {'live_event_list': {
      'live_event': [
        {
          '$': {href: '/live_events/1'},
          name: 'Event 1',
          input: {name: 'input_1'},
        },
        {
          '$': {href: '/live_events/2'},
          name: 'Event 2',
          input: {name: 'input_1'},
        },
      ],
    }};

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'GET',
        url: '/api/live_events',
        qs: null,
        headers: {},
        body: null,
      });
      callback(null, {statusCode: 200, headers: {'content-type': 'application/xml'}}, xmlEventList);
    };

    return client.sendRequest('GET', '/live_events', null).then(
      (data) => {
        assert.deepEqual(data, eventList);
      }
    );
  });

  it('sendRequest should include version number in PUT requests', () => {
    const client = new ElementalClient('http://my-elemental-server', null, 'v2.17.3.0');
    const body = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><name>My live event!</name>';

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'PUT',
        url: '/api/v2.17.3.0/live_events/5',
        qs: null,
        headers: {'Content-Type': 'application/xml'},
        body,
      });
      callback(null, {statusCode: 200, headers: {'content-type': 'application/xml'}}, body);
    };

    return client.sendRequest('PUT', '/live_events/5', null, {name: 'My live event!'}).then(
      (data) => {
        assert.deepEqual(data, {name: 'My live event!'});
      }
    );
  });

  it('sendRequest should reject promise on request errors', (done) => {
    const client = new ElementalClient('http://my-elemental-server');

    client.req = (opts, callback) => {
      callback({error: 'failed to resolve name'});
    };

    client.sendRequest('GET', '/live_events/1233', null, null).then(
      () => assert(false),
      (reason) => {
        assert.deepEqual(reason, {error: 'failed to resolve name'});
        done();
      }
    );
  })

  it('sendRequest should reject promise on http errors', (done) => {
    const client = new ElementalClient('http://my-elemental-server');

    client.req = (opts, callback) => {
      callback(null, {statusCode: 404}, {'errors': []});
    };

    client.sendRequest('GET', '/live_events/1233', null, null).then(
      () => assert(false),
      (reason) => {
        assert.equal(reason.statusCode, 404);
        assert.deepEqual(reason.body, {'errors': []});
        done();
      }
    );
  });

  it('liveEvents should return a LiveEvent instance', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const le = client.liveEvents();

    assert(le instanceof LiveEvent);
    assert.equal(le.elementalClient, client);
  });

  it('presets should return a presets Resource', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const presets = client.presets();

    assert.deepEqual(presets, new Resource(client, 'presets'));
  });

  it('schedules should return a schedules Resource', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const scheds = client.schedules();

    assert.deepEqual(scheds, new Resource(client, 'schedules'));
  });

  it('liveEventProfiles should return a live_event_profiles Resource', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const lep = client.liveEventProfiles();

    assert.deepEqual(lep, new Resource(client, 'live_event_profiles'));
  });

  it('presetCategories should return a preset_categories Resource', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const presetCategories = client.presetCategories();

    assert.deepEqual(presetCategories, new Resource(client, 'preset_categories'));
  });

  it('devices should return an instance of Devices', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const devices = client.devices();

    assert(devices instanceof Device);
    assert.equal(devices.elementalClient, client);
  });

  it('format date should return date in ISO format', () => {
    assert.equal('2017-02-10 11:57:03 +0000', ElementalClient.formatDate(new Date('2017-02-10 11:57:03 +0000')));
    assert.equal('2017-02-10 11:57:03 +0000', ElementalClient.formatDate(new Date('2017-02-10T11:57:03Z')));
    assert.equal('2017-02-10 11:58:03 +0000', ElementalClient.formatDate(new Date('2017-02-10T11:58:03Z')));
    assert.equal('2017-02-11 02:58:03 +0000', ElementalClient.formatDate(new Date('2017-02-10 23:58:03 -0300')));
  });

  it('extractIdFromHref should return ID from the object href', () => {
    const obj = {'$': {href: '/live_event_profiles/120'}};

    assert.equal('120', ElementalClient.extractIdFromHref(obj));
  });

  it('extractIdFromHref should return empty string when no id is found', () => {
    const obj = {'$': {href: '/live_event_profiles/120/wat'}};

    assert.equal('', ElementalClient.extractIdFromHref(obj));
  });

  it('extractIdFromHref should return empty string parameter is invalid', () => {
    const obj = {'$': {}};

    assert.equal('', ElementalClient.extractIdFromHref(obj));
    assert.equal('', ElementalClient.extractIdFromHref(''));
  });
});
