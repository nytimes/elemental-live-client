import ElementalClient from '../lib/elemental-client';
import {assert} from 'chai';
import sinon from 'sinon';

describe('ElementalClient', () => {
  it('sendRequest without data', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const callback = (data) => data;

    client.req = sinon.stub();
    client.sendRequest('GET', '/api/live_events', {page: '3', 'per_page': 30}, null, callback);

    assert(client.req.calledWith({
      method: 'GET',
      url: '/api/live_events',
      qs: {'page': '3', 'per_page': 30},
      headers: {},
      json: false,
      body: null,
    }, callback))
  });

  it('sendRequest with data', () => {
    const client = new ElementalClient('http://my-elemental-server');
    const callback = (data) => data;

    client.req = sinon.stub();
    client.sendRequest('POST', '/api/live_events', null, {name: 'My Live Event'}, callback);

    assert(client.req.calledWith({
      method: 'POST',
      url: '/api/live_events',
      qs: null,
      headers: {'Content-Type': 'application/json'},
      json: true,
      body: {name: 'My Live Event'},
    }, callback))
  });
});
