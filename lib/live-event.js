import {Resource} from './resource';

export class LiveEvent extends Resource {
  constructor(elementalClient) {
    super(elementalClient, 'live_events');

    // these operations are mapped to methods named <operation>Event, that
    // modifies the event. For example: startEvent, stopEvent and resetEvent.
    ['start', 'stop', 'cancel', 'archive', 'reset'].forEach((opName) => {
      this[`${opName}Event`] = (eventId) => this.elementalClient.sendRequest('POST', `/api/live_events/${eventId}/${opName}`);
    });
  }

  eventStatus(eventId) {
    return this.elementalClient.sendRequest('GET', `/api/live_events/${eventId}/status`);
  }

  listInputs(eventId) {
    return this.elementalClient.sendRequest('GET', `/api/live_events/${eventId}/inputs`);
  }

  muteEvent(eventId) {
    return this.elementalClient.sendRequest('POST', `/api/live_events/${eventId}/mute_audio`);
  }

  unmuteEvent(eventId) {
    return this.elementalClient.sendRequest('POST', `/api/live_events/${eventId}/unmute_audio`);
  }

  adjustAudioGain(eventId, gain) {
    return this.elementalClient.sendRequest('POST', `/api/live_events/${eventId}/adjust_audio_gain`, null, {gain});
  }

  eventPriority(eventId) {
    return this.elementalClient.sendRequest('GET', `/api/live_events/${eventId}/priority`);
  }

  setEventPriority(eventId, priority) {
    return this.elementalClient.sendRequest('POST', `/api/live_events/${eventId}/priority`, null, {priority});
  }
}
