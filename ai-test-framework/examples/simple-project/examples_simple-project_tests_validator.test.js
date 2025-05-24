const Validator = require('../src/validator');

describe('Validator', () => {
  describe('isEmail', () => {
    test('validates correct emails', () => {
      expect(Validator.isEmail('user@example.com')).toBe(true);
      expect(Validator.isEmail('test.user+tag@domain.co.uk')).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(Validator.isEmail('notanemail')).toBe(false);
      expect(Validator.isEmail('@example.com')).toBe(false);
      expect(Validator.isEmail('user@')).toBe(false);
    });
  });

  describe('isStrongPassword', () => {
    test('validates strong passwords', () => {
      expect(Validator.isStrongPassword('P@ssw0rd123')).toBe(true);
      expect(Validator.isStrongPassword('Str0ng!Pass')).toBe(true);
    });

    test('rejects weak passwords', () => {
      expect(Validator.isStrongPassword('password')).toBe(false);
      expect(Validator.isStrongPassword('12345678')).toBe(false);
      expect(Validator.isStrongPassword('Password1')).toBe(false); // No special char
    });
  });

  describe('sanitizeInput', () => {
    test('removes dangerous characters', () => {
      expect(Validator.sanitizeInput('<script>alert("xss")</script>'))
        .toBe('script>alert("xss")/script>');
    });

    test('trims whitespace', () => {
      expect(Validator.sanitizeInput('  hello world  ')).toBe('hello world');
    });
  });
});