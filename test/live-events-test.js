import LiveEvents from '../lib/live-events';
import {assert} from 'chai';
import sinon from 'sinon';

describe('LiveEvents', () => {
  it('list should sendRequest to ElementalClient', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const liveEvents = new LiveEvents(client);
    const result = liveEvents.list({page: 1});

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', '/api/live_events', {page: 1}))
  });
});
