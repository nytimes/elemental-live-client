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
      assert(sendRequest.calledWith('POST', '/api/devices/123/preview', null, {
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

  describe('generate preview', () => {
    const retval = {};
    const sendRequest = sinon.stub().returns(retval);
    const dvc = new Device({sendRequest});
    const result = dvc.generatePreview({id: '10', sourceType: 'DeviceInput,2,1,AJA,HD-SDI'});
    const expectedBody = 'input_key=0&live_event[inputs_attributes][0][source_type]=DeviceInput,2,1,AJA,HD-SDI&live_event[inputs_attributes][0][device_input_attributes][sdi_settings_attributes][input_format]=Auto&live_event[inputs_attributes][0][device_input_attributes][device_id]=10';
    const expectedHeaders = {
      Accept: '*/*',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    };

    assert.equal(result, retval);
    assert(sendRequest.calledOnce);

    const args = sendRequest.getCall(0).args;

    assert.equal(args[0], 'POST');
    assert.equal(args[1], '/inputs/generate_preview');
    assert.equal(args[2], null);
    assert.equal(args[3], expectedBody);
    assert.deepEqual(args[4], expectedHeaders);
  });
});
