import request from 'request';

export default class ElementalClient {
  constructor(serverUrl) {
    this.req = request.defaults({
      headers: {'Accept': 'application/json'},
      baseUrl: serverUrl,
    });
  }

  sendRequest(method, path, qs, data, callback) {
    const headers = {};
    const url = path;
    let json = false;

    if (data) {
      json = true;
      headers['Content-Type'] = 'application/json';
    }
    this.req({
      method,
      url,
      headers,
      json,
      qs,
      body: data,
    }, callback);
  }
}
