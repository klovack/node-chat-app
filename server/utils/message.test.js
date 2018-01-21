const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const message = generateMessage('Rizki', 'Hallo');
    expect(message).toMatchObject({
      from: 'Rizki',
      text: 'Hallo',
    });
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location message object', () => {
    const from = 'Rizki';
    const latitude = 3.555;
    const longitude = 80.2451;
    const message = generateLocationMessage(from, latitude, longitude);
    
    expect(message).toMatchObject({
      from,
      url: `https://www.google.com/maps?q=${latitude},${longitude}`,
    });
    expect(typeof message.createdAt).toBe('number');
  });
});
