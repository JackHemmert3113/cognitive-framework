const { faker } = require('@faker-js/faker');

/**
 * Generic Test Utilities
 * Base utilities that can be extended for any domain
 */
class GenericTestUtils {
  /**
   * Generate a generic user object
   */
  static generateUser(overrides = {}) {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      name: faker.person.fullName(),
      avatar: faker.image.avatar(),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
      ...overrides
    };
  }

  /**
   * Generate generic API response
   */
  static mockAPIResponse(data, options = {}) {
    const {
      status = 200,
      delay = 0,
      headers = {},
      error = null
    } = options;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (error || status >= 400) {
          reject({
            status,
            error: error || 'Request failed',
            timestamp: new Date().toISOString(),
            headers
          });
        } else {
          resolve({
            status,
            data,
            timestamp: new Date().toISOString(),
            headers: {
              'content-type': 'application/json',
              ...headers
            }
          });
        }
      }, delay);
    });
  }

  /**
   * Generate pagination data
   */
  static generatePagination(total, page = 1, limit = 20) {
    const totalPages = Math.ceil(total / limit);
    
    return {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  /**
   * Generate date range
   */
  static generateDateRange(days = 30) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    return { start, end };
  }

  /**
   * Generate mock file
   */
  static generateFile(type = 'document') {
    const fileTypes = {
      document: ['pdf', 'doc', 'docx', 'txt'],
      image: ['jpg', 'png', 'gif', 'svg'],
      video: ['mp4', 'avi', 'mov'],
      audio: ['mp3', 'wav', 'ogg']
    };

    const extension = faker.helpers.arrayElement(fileTypes[type] || fileTypes.document);
    
    return {
      id: faker.string.uuid(),
      name: `${faker.system.fileName()}.${extension}`,
      size: faker.number.int({ min: 1000, max: 10000000 }),
      type: `${type}/${extension}`,
      url: faker.image.url(),
      uploadedAt: faker.date.recent()
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  /**
   * Validate required fields
   */
  static validateRequired(obj, fields) {
    const errors = [];
    
    for (const field of fields) {
      if (!obj[field]) {
        errors.push(`${field} is required`);
      }
    }
    
    return { valid: errors.length === 0, errors };
  }

  /**
   * Generate test scenario
   */
  static generateScenario(name, steps, data = {}) {
    return {
      id: faker.string.uuid(),
      name,
      steps,
      data,
      createdAt: new Date(),
      status: 'pending'
    };
  }

  /**
   * Wait utility for async tests
   */
  static wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry utility for flaky operations
   */
  static async retry(fn, options = {}) {
    const {
      times = 3,
      delay = 1000,
      backoff = 2
    } = options;

    let lastError;
    
    for (let i = 0; i < times; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        if (i < times - 1) {
          await this.wait(delay * Math.pow(backoff, i));
        }
      }
    }
    
    throw lastError;
  }
}

module.exports = GenericTestUtils;
