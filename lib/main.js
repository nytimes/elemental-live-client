const dateFormat = require('dateformat');
const request = require('request');
const xml2js = require('xml2js');

const LiveEvent = require('./live-event').LiveEvent;
const Resource = require('./resource').Resource;

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

  sendRequest(method, path, qs, data, headers) {
    const reqHeaders = headers || {};
    const url = path;

    return new Promise((resolve, reject) => {
      let reqBody = null;

      if (data) {
        reqBody = new xml2js.Builder({renderOpts: {pretty: false}}).buildObject(data);
        reqHeaders['Content-Type'] = 'application/xml';
      }

      this.req({method, url, qs, headers: reqHeaders, body: reqBody},
        (err, resp, respBody) => {
          if (err) {
            reject(err);
          } else if (resp.statusCode > 299) {
            reject({statusCode: resp.statusCode, body: respBody});
          } else {
            const contentType = resp.headers['content-type'];

            if (contentType && contentType.match(/^application\/xml(;.+)?$/)) {
              const parser = new xml2js.Parser({
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
    return dateFormat(date, 'yyyy-mm-dd HH:MM:ss o', true);
  }

  static extractIdFromHref(obj) {
    const attrs = obj.$;

    if (attrs && attrs.href) {
      const match = attrs.href.match(/\d+$/);

      if (match) {
        return match[0];
      }
    }

    return '';
  }
}
