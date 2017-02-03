export class Resource {
  constructor(elementalClient, name) {
    this.elementalClient = elementalClient;
    this.name = name;
  }

  create(opts) {
    return this.elementalClient.sendRequest('POST', `/api/${this.name}`, null, opts);
  }

  retrieve(id) {
    return this.elementalClient.sendRequest('GET', `/api/${this.name}/${id}`);
  }

  update(id, opts) {
    return this.elementalClient.sendRequest('PUT', `/api/${this.name}/${id}`, null, opts);
  }

  delete(id) {
    return this.elementalClient.sendRequest('DELETE', `/api/${this.name}/${id}`);
  }

  list(opts) {
    return this.elementalClient.sendRequest('GET', `/api/${this.name}`, opts);
  }
}
