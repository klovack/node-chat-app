const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    message = generateMessage('Rizki', 'Hallo');
    expect(message).toMatchObject({
      from: 'Rizki',
      text: 'Hallo',
    });
    expect(typeof message.createdAt).toBe('number');
  });
});
