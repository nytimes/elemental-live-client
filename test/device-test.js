import {Device} from '../lib/device';
import {Resource} from '../lib/resource';
import {assert} from 'chai';
import sinon from 'sinon';

describe('Device', () => {
  it('Device should be a Resource', () => {
    const client = {'some': 'object'};
    const dv = new Device(client);

    assert(dv instanceof Resource);
    assert.equal(dv.elementalClient, client);
    assert.equal(dv.name, 'devices');
  });

  it('preview should get the preview of the device', () => {
    const previewImage = {
      width: 854,
      height: 480,
      name: 'device-123-preview.jpg',
      location: '/images/preview/device-123-preview.jpg',
    };
    const retval = new Promise((resolve) => {
      resolve({
        'preview_images': {'preview_image': previewImage},
      });
    });
    const sendRequest = sinon.stub().returns(retval);
    const dvc = new Device({sendRequest});

    return dvc.preview({id: 123, width: 854, height: 480}).then((data) => {
      assert.deepEqual(data, previewImage);

      const expectedParams = {
        'preview_images': {
          'preview_image': {
            width: 854,
            height: 480,
            name: 'device-123-preview.jpg',
          },
        },
      };
      const call = sendRequest.getCalls()[0];
      const params = call.args[3];
      const name = params.preview_images.preview_image.name;

      expectedParams.preview_images.preview_image.name = name;
      assert.deepEqual(params, expectedParams);
      assert.equal(call.args[0], 'POST');
      assert.equal(call.args[1], '/api/devices/123/preview');
      assert.equal(call.args[2], null);
      assert.match(name, /^device-123-[\d.]+-preview.jpg$/);
    });
  });

  describe('preview missing parameters', () => {
    const test = (opts, msg) => {
      const dvc = new Device({});

      assert.throws(() => dvc.preview(opts), Error, msg);
    };

    it('id', () => {
      test({width: 1280, height: 720}, 'missing device id');
    });

    it('width', () => {
      test({id: '123', height: 720}, 'missing preview width');
    });

    it('height', () => {
      test({id: '123', width: 1280}, 'missing preview height');
    });
  });
});
