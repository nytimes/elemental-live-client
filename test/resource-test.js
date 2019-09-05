import {Resource} from '../lib/resource';
import {assert} from 'chai';
import sinon from 'sinon';

describe('Resource', () => {
  const resourceName = 'stuff';
  const resourceUrl = '/api/stuff';
  const dummyVersion = '2.14'
  const versionedUrl = `/api/${dummyVersion}/stuff`;
  const retval = {key: 'value'};
  let client = {};

  beforeEach(() => {
    client = {sendRequest: sinon.stub().returns(retval)};
  });

  it('create', () => {
    const resource = new Resource(client, resourceName);
    const data = {name: 'Some stuff', description: 'Best stuff ever!'};
    const result = resource.create(data);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', resourceUrl, null, data))
  });

  it('create with version', () => {
    client.version = dummyVersion;
    const resource = new Resource(client, resourceName);
    const data = {name: 'Some stuff', description: 'Best stuff ever!'};
    const result = resource.create(data);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('POST', versionedUrl, null, data))
  });

  it('retrieve', () => {
    const resource = new Resource(client, resourceName);
    const result = resource.retrieve(10);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', `${resourceUrl}/10`))
  });

  it('retrieve with version', () => {
    client.version = dummyVersion;
    const resource = new Resource(client, resourceName);
    const result = resource.retrieve(10);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', `${versionedUrl}/10`))
  });

  it('update', () => {
    const resource = new Resource(client, resourceName);
    const data = {description: 'Stuff number 10 (is this binary or decimal?)'}
    const result = resource.update(10, data);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('PUT', `${resourceUrl}/10`, null, data))
  });

  it('update with version', () => {
    client.version = dummyVersion;
    const resource = new Resource(client, resourceName);
    const data = {description: 'Stuff number 10 (is this binary or decimal?)'}
    const result = resource.update(10, data);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('PUT', `${versionedUrl}/10`, null, data))
  });

  it('delete', () => {
    const resource = new Resource(client, resourceName);
    const result = resource.delete(10);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('DELETE', `${resourceUrl}/10`))
  });

  it('delete with version', () => {
    client.version = dummyVersion;
    const resource = new Resource(client, resourceName);
    const result = resource.delete(10);

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('DELETE', `${versionedUrl}/10`))
  });

  it('list', () => {
    const resource = new Resource(client, resourceName);
    const result = resource.list({page: 1});

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', resourceUrl, {page: 1}))
  });

  it('list with version', () => {
    client.version = dummyVersion;
    const resource = new Resource(client, resourceName);
    const result = resource.list({page: 1});

    assert.equal(result, retval);
    assert(client.sendRequest.calledWith('GET', versionedUrl, {page: 1}))
  });
});
