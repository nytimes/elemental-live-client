import ElementalClient from '../lib/elemental-client';
import {LiveEvents} from '../lib/live-events';
import {assert} from 'chai';

describe('ElementalClient', () => {
  it('sendRequest should support "data-less" requests and resolve promise on response', (done) => {
    const client = new ElementalClient('http://my-elemental-server');
    const eventList = [{name: 'Live event 1'}, {name: 'Live event 2'}];

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'GET',
        url: '/api/live_events',
        qs: {'page': '3', 'per_page': 30},
        headers: {},
        json: false,
        body: null,
      });
      callback(null, {statusCode: 200}, eventList);
    };

    client.sendRequest('GET', '/api/live_events', {page: '3', 'per_page': 30}, null).then(
      (data) => {
        assert.equal(data.statusCode, 200);
        assert.deepEqual(data.body, eventList);
        done();
      }
    );
  });

  it('sendRequest should send data and resolve promise on response', (done) => {
    const client = new ElementalClient('http://my-elemental-server');
    const eventList = [{name: 'Live event 1'}, {name: 'Live event 2'}];

    client.req = (opts, callback) => {
      assert.deepEqual(opts, {
        method: 'POST',
        url: '/api/live_events',
        qs: null,
        headers: {'Content-Type': 'application/json'},
        json: true,
        body: {name: 'My live event!'},
      });
      callback(null, {statusCode: 200}, eventList);
    };

    client.sendRequest('POST', '/api/live_events', null, {name: 'My live event!'}).then(
      (data) => {
        assert.equal(data.statusCode, 200);
        assert.deepEqual(data.body, eventList);
        done();
      }
    );
  });

  it('sendRequest should reject promise on request errors', (done) => {
    const client = new ElementalClient('http://my-elemental-server');

    client.req = (opts, callback) => {
      callback({error: 'failed to resolve name'});
    };

    client.sendRequest('GET', '/api/live_events/1233', null, null).then(
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

    client.sendRequest('GET', '/api/live_events/1233', null, null).then(
      () => assert(false),
      (reason) => {
        assert.equal(reason.statusCode, 404);
        assert.deepEqual(reason.body, {'errors': []});
        done();
      }
    );
  });

  it('liveEvents should return a liveEvents instance', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const le = client.liveEvents();

    assert.deepEqual(le, new LiveEvents(client));
  });
});
