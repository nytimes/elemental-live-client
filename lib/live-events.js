import {Resource} from './resource';

export class LiveEvents extends Resource {
  constructor(elementalClient) {
    super(elementalClient, 'live_events');
  }
}
