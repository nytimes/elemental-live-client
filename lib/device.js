const resource = require('./resource');

const queryString = (object) => {
  const parts = [];

  for (const key in object) {
    if (Reflect.apply(Object.prototype.hasOwnProperty, object, [key])) {
      parts.push(`${key}=${object[key]}`);
    }
  }

  return parts.join('&');
};

class Device extends resource.Resource {
  constructor(elementalClient) {
    super(elementalClient, 'devices');
  }

  preview(opts) {
    if (!opts.id) {
      throw new Error('missing device id');
    }
    if (!opts.name) {
      throw new Error('missing preview name');
    }
    if (!opts.width) {
      throw new Error('missing preview width');
    }
    if (!opts.height) {
      throw new Error('missing preview height');
    }

    const data = {
      'preview_images': {
        'preview_image': {
          name: opts.name,
          height: opts.height,
          width: opts.width,
        },
      },
    };

    return this.elementalClient.sendRequest('POST', `/api/devices/${opts.id}/preview`, null, data).
      then((respData) => respData.preview_images.preview_image);
  }

  generatePreview(opts) {
    if (!opts.id) {
      throw new Error('missing device id');
    }
    if (!opts.sourceType) {
      throw new Error('missing source type');
    }

    const inputData = {
      'input_key': 0,
      'live_event[inputs_attributes][0][source_type]': opts.sourceType,
      'live_event[inputs_attributes][0][device_input_attributes][sdi_settings_attributes][input_format]': 'Auto',
      'live_event[inputs_attributes][0][device_input_attributes][device_id]': opts.id,
    };
    const body = queryString(inputData);
    const headers = {
      'Accept': '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    return this.elementalClient.sendRequest('POST', '/inputs/generate_preview', null, body, headers);
  }
}

module.exports = {Device};
