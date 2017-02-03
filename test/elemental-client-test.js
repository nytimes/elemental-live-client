import ElementalClient from '../lib/elemental-client';

describe('ElementalClient', () => {
  it('should receive credentials on the constructor', () => {
    const client = new ElementalClient('http://my-elemental-server', 'user', 'key');
  });
});
