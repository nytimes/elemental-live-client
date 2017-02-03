import {LiveEvent} from '../lib/live-event';
import {Resource} from '../lib/resource';
import {assert} from 'chai';
import sinon from 'sinon';

describe('LiveEvent', () => {
  it('LiveEvent should be a Resource', () => {
    const client = {'some': 'object'};
    const le = new LiveEvent(client);

    assert(le instanceof Resource);
    assert.equal(le.elementalClient, client);
    assert.equal(le.name, 'live_events');
  });

  it('listInputs should list inputs of an event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.listInputs(199);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', '/api/live_events/199/inputs'));
  });

  it('eventStatus should retrieve the status of an event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.eventStatus(199);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', '/api/live_events/199/status'));
  })
});
