import {Resource} from './resource';

export class LiveEvent extends Resource {
  constructor(elementalClient) {
    super(elementalClient, 'live_events');
  }
}
