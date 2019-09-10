class Resource {
  constructor(elementalClient, name) {
    this.elementalClient = elementalClient;
    this.name = name;
  }

  create(opts) {
    return this.elementalClient.sendRequest('POST', `/${this.name}`, null, opts);
  }

  retrieve(id) {
    return this.elementalClient.sendRequest('GET', `/${this.name}/${id}`);
  }

  update(id, opts) {
    return this.elementalClient.sendRequest('PUT', `/${this.name}/${id}`, null, opts);
  }

  delete(id) {
    return this.elementalClient.sendRequest('DELETE', `/${this.name}/${id}`);
  }

  list(opts) {
    return this.elementalClient.sendRequest('GET', `/${this.name}`, opts);
  }
}

module.exports = {Resource};
