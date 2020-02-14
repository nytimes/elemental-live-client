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

    return dvc.preview({id: 123, name: 'device-123-preview.jpg', width: 854, height: 480}).then((data) => {
      assert.deepEqual(data, previewImage);
      assert(sendRequest.calledWith('POST', '/devices/123/preview', null, {
        'preview_images': {
          'preview_image': {
            width: 854,
            height: 480,
            name: 'device-123-preview.jpg',
          },
        },
      }));
    });
  });

  describe('preview missing parameters', () => {
    const test = (opts, msg) => {
      const dvc = new Device({});

      assert.throws(() => dvc.preview(opts), Error, msg);
    };

    it('id', () => {
      test({name: 'some-preview', width: 1280, height: 720}, 'missing device id');
    });

    it('name', () => {
      test({id: '123', width: 1280, height: 720}, 'missing preview name');
    });

    it('width', () => {
      test({id: '123', name: 'some-preview', height: 720}, 'missing preview width');
    });

    it('height', () => {
      test({id: '123', name: 'some-preview', width: 1280}, 'missing preview height');
    });
  });
});
