const resource = require('./resource');

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
}

module.exports = {Device};
