const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const toTest = 123124125;
    const isValid = isRealString(toTest);
    expect(isValid).toBe(false);
  });

  it('should reject string with only spaces', () => {
    const toTest = '              ';
    const isValid = isRealString(toTest);
    expect(isValid).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    const toTest = 'thisIsTheTrueTest';
    const isValid = isRealString(toTest);
    expect(isValid).toBe(true);
  });
});
