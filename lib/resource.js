class Resource {
  constructor(elementalClient, name) {
    this.elementalClient = elementalClient;
    this.name = name;
    this.version = elementalClient.version ? `${elementalClient.version}/` : '';
  }

  create(opts) {
    return this.elementalClient.sendRequest('POST', `/api/${this.version}${this.name}`, null, opts);
  }

  retrieve(id) {
    return this.elementalClient.sendRequest('GET', `/api/${this.version}${this.name}/${id}`);
  }

  update(id, opts) {
    return this.elementalClient.sendRequest('PUT', `/api/${this.version}${this.name}/${id}`, null, opts);
  }

  delete(id) {
    return this.elementalClient.sendRequest('DELETE', `/api/${this.version}${this.name}/${id}`);
  }

  list(opts) {
    return this.elementalClient.sendRequest('GET', `/api/${this.version}${this.name}`, opts);
  }
}

module.exports = {Resource};
