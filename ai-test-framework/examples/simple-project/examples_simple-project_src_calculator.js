/**
 * Simple Calculator Module
 * Example for AI Test Framework
 */
class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }

  multiply(a, b) {
    return a * b;
  }

  divide(a, b) {
    if (b === 0) {
      throw new Error('Division by zero');
    }
    return a / b;
  }

  percentage(value, percent) {
    return (value * percent) / 100;
  }
}

module.exports = Calculator;