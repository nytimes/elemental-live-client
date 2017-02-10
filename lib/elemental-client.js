import {Builder, Parser} from 'xml2js';
import {LiveEvent} from './live-event';
import {Resource} from './resource';
import request from 'request';

export default class ElementalClient {
  constructor(serverUrl) {
    this.req = request.defaults({
      headers: {'Accept': 'application/xml'},
      baseUrl: serverUrl,
    });

    const resourceMap = {
      'presets': 'presets',
      'schedules': 'schedules',
      'liveEventProfiles': 'live_event_profiles',
      'presetCategories': 'preset_categories',
      'devices': 'devices',
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

    return new Promise((resolve, reject) => {
      let reqBody = null;

      if (data) {
        reqBody = new Builder({renderOpts: {pretty: false}}).buildObject(data);
        headers['Content-Type'] = 'application/xml';
      }

      this.req({method, url, headers, qs, body: reqBody},
        (err, resp, respBody) => {
          if (err) {
            reject(err);
          } else if (resp.statusCode > 299) {
            reject({statusCode: resp.statusCode, body: respBody});
          } else {
            const contentType = resp.headers['content-type'];

            if (contentType && contentType.match(/^application\/xml(;.+)?$/)) {
              const parser = new Parser({
                trim: true,
                explicitArray: false,
              });

              parser.parseString(respBody, (xmlErr, respData) => {
                if (xmlErr) {
                  reject({statusCode: resp.StatusCode, xmlErr, body: respBody});
                } else {
                  resolve(respData);
                }
              });
            } else {
              resolve(respBody);
            }
          }
        });
    });
  }

  liveEvents() {
    return new LiveEvent(this);
  }

  static formatDate(date) {
    return date.toISOString();
  }
}
