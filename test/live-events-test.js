import {LiveEvents} from '../lib/live-events';
import {Resource} from '../lib/resource';
import {assert} from 'chai';
import sinon from 'sinon';

describe('LiveEvents', () => {
  it('LiveEvents should be a Resource', () => {
    const client = {'some': 'object'};
    const le = new LiveEvents(client);

    assert(le instanceof Resource);
    assert.equal(le.elementalClient, client);
    assert.equal(le.name, 'live_events');
  });
});
