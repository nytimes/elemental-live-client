const resource = require('./resource');

class LiveEvent extends resource.Resource {
  constructor(elementalClient) {
    super(elementalClient, 'live_events');

    // these operations are mapped to methods named <operation>Event, that
    // modifies the event. For example: startEvent, stopEvent and resetEvent.
    ['start', 'stop', 'cancel', 'archive', 'reset'].forEach((opName) => {
      this[`${opName}Event`] = (eventId) => this.elementalClient.sendRequest('POST', `/live_events/${eventId}/${opName}`);
    });
  }

  // the status endpoint for a live event provides additional undocumented information like audio_level
  // when the Accept header is set to application/json
  eventStatus(eventId, headers = null) {
    return this.elementalClient.sendRequest('GET', `/live_events/${eventId}/status`, null, null, headers);
  }

  listInputs(eventId) {
    return this.elementalClient.sendRequest('GET', `/live_events/${eventId}/inputs`);
  }

  muteEvent(eventId) {
    return this.elementalClient.sendRequest('POST', `/live_events/${eventId}/mute_audio`);
  }

  unmuteEvent(eventId) {
    return this.elementalClient.sendRequest('POST', `/live_events/${eventId}/unmute_audio`);
  }

  adjustAudioGain(eventId, gain) {
    return this.elementalClient.sendRequest('POST', `/live_events/${eventId}/adjust_audio_gain`, null, {gain});
  }

  eventPriority(eventId) {
    return this.elementalClient.sendRequest('GET', `/live_events/${eventId}/priority`);
  }

  setEventPriority(eventId, priority) {
    return this.elementalClient.sendRequest('POST', `/live_events/${eventId}/priority`, null, {priority});
  }

  eventProgressPreview(eventId) {
    return `${this.elementalClient.serverUrl}/images/thumbs/progress_job_${eventId}.jpg`;
  }

  activateInput(eventId, input_id) {
    return this.elementalClient.sendRequest('POST', `/live_events/${eventId}/activate_input`, null, {input_id});
  }
}

module.exports = {LiveEvent};
