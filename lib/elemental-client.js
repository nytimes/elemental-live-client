import request from 'request';

export default class ElementalClient {
  constructor(serverUrl) {
    this.req = request.defaults({
      headers: {'Accept': 'application/json'},
      baseUrl: serverUrl,
    });
  }

  sendRequest(method, path, qs, data) {
    const headers = {};
    const url = path;
    let json = false;

    return new Promise((resolve, reject) => {
      if (data) {
        json = true;
        headers['Content-Type'] = 'application/json';
      }
      this.req({method, url, headers, json, qs, body: data},
        (err, resp, body) => {
          const parg = {};

          if (err) {
            reject(err);
          } else {
            parg.statusCode = resp.statusCode;
            parg.body = body;
            if (resp.statusCode > 300) {
              reject(parg);
            } else {
              resolve(parg);
            }
          }
        });
    });
  }
}
