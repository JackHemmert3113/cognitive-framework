/**
 * Input Validator Module
 * Example for AI Test Framework
 */
class Validator {
  static isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  static isPhone(phone) {
    const regex = /^\+?[\d\s-()]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  static isURL(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isStrongPassword(password) {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  static sanitizeInput(input) {
    return input
      .trim()
      .replace(/[<>]/g, '')
      .substring(0, 255);
  }
}

module.exports = Validator;