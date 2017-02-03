import {LiveEvent} from '../lib/live-event';
import {Resource} from '../lib/resource';
import {assert} from 'chai';

describe('LiveEvent', () => {
  it('LiveEvent should be a Resource', () => {
    const client = {'some': 'object'};
    const le = new LiveEvent(client);

    assert(le instanceof Resource);
    assert.equal(le.elementalClient, client);
    assert.equal(le.name, 'live_events');
  });
});
