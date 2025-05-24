const chalk = require('chalk');

/**
 * Colorized console output for the AI Test Framework
 */
class Colors {
  constructor(options = {}) {
    this.enabled = options.enabled !== false && chalk.supportsColor;
    this.theme = {
      // Status colors
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue,
      
      // Element colors
      package: chalk.cyan.bold,
      file: chalk.magenta,
      test: chalk.white,
      
      // Metric colors
      coverage: (percent) => {
        if (percent >= 80) return chalk.green;
        if (percent >= 60) return chalk.yellow;
        return chalk.red;
      },
      
      // Special colors
      ai: chalk.hex('#00D9FF'), // AI blue
      highlight: chalk.bgYellow.black,
      dim: chalk.dim,
      
      ...options.theme
    };
  }

  // Status methods
  success(text) {
    return this.enabled ? this.theme.success(text) : text;
  }

  error(text) {
    return this.enabled ? this.theme.error(text) : text;
  }

  warning(text) {
    return this.enabled ? this.theme.warning(text) : text;
  }

  info(text) {
    return this.enabled ? this.theme.info(text) : text;
  }

  // Element methods
  package(text) {
    return this.enabled ? this.theme.package(text) : text;
  }

  file(text) {
    return this.enabled ? this.theme.file(text) : text;
  }

  test(text) {
    return this.enabled ? this.theme.test(text) : text;
  }

  // Metric methods
  coverage(percent, text) {
    if (!this.enabled) return text;
    return this.theme.coverage(percent)(text);
  }

  // Special methods
  ai(text) {
    return this.enabled ? this.theme.ai(text) : text;
  }

  highlight(text) {
    return this.enabled ? this.theme.highlight(text) : text;
  }

  dim(text) {
    return this.enabled ? this.theme.dim(text) : text;
  }

  // Icons
  icon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      running: '🏃',
      complete: '🎉',
      ai: '🤖',
      test: '🧪',
      coverage: '📊',
      time: '⏱️',
      package: '📦'
    };
    
    return icons[type] || '';
  }

  // Formatted messages
  status(type, message) {
    const icon = this.icon(type);
    const colorFn = this.theme[type] || ((x) => x);
    
    return `${icon} ${this.enabled ? colorFn(message) : message}`;
  }

  // Box drawing
  box(content, options = {}) {
    const { title, padding = 1, borderColor = 'blue' } = options;
    
    const lines = content.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length), title ? title.length + 2 : 0);
    
    const top = '┌' + '─'.repeat(maxLength + padding * 2) + '┐';
    const bottom = '└' + '─'.repeat(maxLength + padding * 2) + '┘';
    const side = '│';
    
    let result = [];
    
    // Top border with optional title
    if (title) {
      const titleStr = ` ${title} `;
      const beforeTitle = Math.floor((maxLength + padding * 2 - titleStr.length) / 2);
      const afterTitle = maxLength + padding * 2 - titleStr.length - beforeTitle;
      
      result.push('┌' + '─'.repeat(beforeTitle) + titleStr + '─'.repeat(afterTitle) + '┐');
    } else {
      result.push(top);
    }
    
    // Content
    for (const line of lines) {
      const paddedLine = line + ' '.repeat(maxLength - line.length);
      result.push(side + ' '.repeat(padding) + paddedLine + ' '.repeat(padding) + side);
    }
    
    // Bottom border
    result.push(bottom);
    
    const boxStr = result.join('\n');
    return this.enabled && borderColor ? this.theme[borderColor](boxStr) : boxStr;
  }

  // Table formatting
  table(headers, rows) {
    const columnWidths = headers.map((h, i) => {
      const headerLen = h.length;
      const maxRowLen = Math.max(...rows.map(r => String(r[i] || '').length));
      return Math.max(headerLen, maxRowLen) + 2;
    });

    // Header
    const headerRow = headers.map((h, i) => {
      return h.padEnd(columnWidths[i]);
    }).join('│');

    // Separator
    const separator = columnWidths.map(w => '─'.repeat(w)).join('┼');

    // Rows
    const dataRows = rows.map(row => {
      return row.map((cell, i) => {
        return String(cell || '').padEnd(columnWidths[i]);
      }).join('│');
    });

    return [
      this.enabled ? chalk.bold(headerRow) : headerRow,
      separator,
      ...dataRows
    ].join('\n');
  }
}

// Export singleton instance
module.exports = new Colors();
