import {Resource} from './resource';

export class LiveEvent extends Resource {
  constructor(elementalClient) {
    super(elementalClient, 'live_events');
  }

  eventStatus(eventId) {
    return this.elementalClient.sendRequest('GET', `/api/live_events/${eventId}/status`);
  }

  listInputs(eventId) {
    return this.elementalClient.sendRequest('GET', `/api/live_events/${eventId}/inputs`);
  }
}
