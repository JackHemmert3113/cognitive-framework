const Calculator = require('../src/calculator');

describe('Calculator', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  describe('add', () => {
    test('adds two positive numbers', () => {
      expect(calc.add(2, 3)).toBe(5);
    });

    test('adds negative numbers', () => {
      expect(calc.add(-1, -1)).toBe(-2);
    });

    test('adds zero', () => {
      expect(calc.add(5, 0)).toBe(5);
    });
  });

  describe('divide', () => {
    test('divides two numbers', () => {
      expect(calc.divide(10, 2)).toBe(5);
    });

    test('throws on division by zero', () => {
      expect(() => calc.divide(10, 0)).toThrow('Division by zero');
    });
  });

  describe('percentage', () => {
    test('calculates percentage correctly', () => {
      expect(calc.percentage(100, 25)).toBe(25);
      expect(calc.percentage(50, 50)).toBe(25);
    });
  });
});