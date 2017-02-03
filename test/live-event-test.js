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

  it('startEvent should send request to start event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.startEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/start'));
  });

  it('stopEvent should send request to stop event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.stopEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/stop'));
  });

  it('cancelEvent should send request to cancel event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.cancelEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/cancel'));
  });

  it('archiveEvent should send request to archive event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.archiveEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/archive'));
  });

  it('resetEvent should send request to reset event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.resetEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/reset'));
  });

  it('muteEvent should send request to mute event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.muteEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/mute_audio'));
  });

  it('unmuteEvent should send request to unmute event', () => {
    const retval = {key: 'value'};
    const client = {sendRequest: sinon.stub().returns(retval)};
    const le = new LiveEvent(client);
    const result = le.unmuteEvent(195);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', '/api/live_events/195/unmute_audio'));
  });
});
