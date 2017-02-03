import {LiveEvent} from './live-event';
import {Resource} from './resource';
import request from 'request';

export default class ElementalClient {
  constructor(serverUrl) {
    this.req = request.defaults({
      headers: {'Accept': 'application/json'},
      baseUrl: serverUrl,
    });

    const resourceMap = {
      'presets': 'presets',
      'schedules': 'schedules',
      'liveEventProfiles': 'live_event_profiles',
      'presetCategories': 'preset_categories',
    };

    for (const methodName in resourceMap) {
      if (Reflect.apply(Object.prototype.hasOwnProperty, resourceMap, [methodName])) {
        this[methodName] = () => new Resource(this, resourceMap[methodName]);
      }
    }
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

  liveEvents() {
    return new LiveEvent(this);
  }
}
