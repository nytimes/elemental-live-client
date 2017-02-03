import {assert} from 'chai';

import ElementalClient from '../lib/elemental-client';

describe('ElementalClient', () => {
  it('should receive credentials on the constructor', () => {
    const client = new ElementalClient('http://my-elemental-server', 'user', 'key');

    assert.equal(client.serverUrl, 'http://my-elemental-server');
    assert.equal(client.user, 'user');
    assert.equal(client.key, 'key');
  });
});
