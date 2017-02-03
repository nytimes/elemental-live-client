export default class LiveEvents {
  constructor(elementalClient) {
    this.elementalClient = elementalClient;
  }

  list(opts) {
    return this.elementalClient.sendRequest('GET', '/api/live_events', opts);
  }
}
