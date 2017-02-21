import {LiveEvent} from '../lib/live-event';
import {Resource} from '../lib/resource';
import {assert} from 'chai';
import sinon from 'sinon';

describe('LiveEvent', () => {
  const getInstance = () => {
    const retval = {key: 'value'};
    const sendRequest = sinon.stub().returns(retval);
    const le = new LiveEvent({sendRequest});

    return {instance: le, retval, sendRequest};
  };

  it('LiveEvent should be a Resource', () => {
    const client = {'some': 'object'};
    const le = new LiveEvent(client);

    assert(le instanceof Resource);
    assert.equal(le.elementalClient, client);
    assert.equal(le.name, 'live_events');
  });

  it('listInputs should list inputs of an event', () => {
    const testData = getInstance();
    const result = testData.instance.listInputs(199);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('GET', '/api/live_events/199/inputs'));
  });

  it('eventStatus should retrieve the status of an event', () => {
    const testData = getInstance();
    const result = testData.instance.eventStatus(199);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('GET', '/api/live_events/199/status', null, null, {'Accept': 'application/json'}));
  })

  it('startEvent should send request to start event', () => {
    const testData = getInstance();
    const result = testData.instance.startEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/start'));
  });

  it('stopEvent should send request to stop event', () => {
    const testData = getInstance();
    const result = testData.instance.stopEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/stop'));
  });

  it('cancelEvent should send request to cancel event', () => {
    const testData = getInstance();
    const result = testData.instance.cancelEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/cancel'));
  });

  it('archiveEvent should send request to archive event', () => {
    const testData = getInstance();
    const result = testData.instance.archiveEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/archive'));
  });

  it('resetEvent should send request to reset event', () => {
    const testData = getInstance();
    const result = testData.instance.resetEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/reset'));
  });

  it('muteEvent should send request to mute event', () => {
    const testData = getInstance();
    const result = testData.instance.muteEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/mute_audio'));
  });

  it('unmuteEvent should send request to unmute event', () => {
    const testData = getInstance();
    const result = testData.instance.unmuteEvent(195);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/unmute_audio'));
  });

  it('adjustAudioGain should send request to adjust audio gain with proper parameter', () => {
    const testData = getInstance();
    const result = testData.instance.adjustAudioGain(195, 3);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/195/adjust_audio_gain', null, {'gain': 3}));
  });

  it('eventPriority should send request to get priority of given event', () => {
    const testData = getInstance();
    const result = testData.instance.eventPriority(199);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('GET', '/api/live_events/199/priority'));
  });

  it('setEventPriority should send request to set the priority of given event', () => {
    const testData = getInstance();
    const result = testData.instance.setEventPriority(199, 1);

    assert.equal(result, testData.retval);
    assert(testData.sendRequest.calledWith('POST', '/api/live_events/199/priority', null, {'priority': 1}));
  });
});
