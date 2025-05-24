const chalk = require('chalk');

/**
 * Progress bar for test execution
 */
class TestProgressBar {
  constructor(total, options = {}) {
    this.total = total;
    this.current = 0;
    this.barLength = options.barLength || 30;
    this.complete = options.complete || '█';
    this.incomplete = options.incomplete || '░';
    this.format = options.format || 'Testing :bar :percent :message';
    this.stream = options.stream || process.stdout;
    this.currentMessage = '';
  }

  start(message = '') {
    this.current = 0;
    this.currentMessage = message;
    this.render();
  }

  tick(message) {
    this.current++;
    this.currentMessage = message || this.currentMessage;
    this.render();
  }

  update(current, message) {
    this.current = current;
    this.currentMessage = message || this.currentMessage;
    this.render();
  }

  render() {
    const percent = Math.floor((this.current / this.total) * 100);
    const filledLength = Math.floor((this.current / this.total) * this.barLength);
    const emptyLength = this.barLength - filledLength;

    const bar = this.complete.repeat(filledLength) + this.incomplete.repeat(emptyLength);
    
    const output = this.format
      .replace(':bar', bar)
      .replace(':percent', `${percent}%`)
      .replace(':current', this.current)
      .replace(':total', this.total)
      .replace(':message', this.currentMessage);

    this.stream.clearLine();
    this.stream.cursorTo(0);
    this.stream.write(output);

    if (this.current >= this.total) {
      this.stream.write('\n');
    }
  }

  complete(message = 'Complete!') {
    this.current = this.total;
    this.currentMessage = message;
    this.render();
  }
}

/**
 * Multi-progress bar for parallel test execution
 */
class MultiProgressBar {
  constructor() {
    this.bars = new Map();
    this.rendering = false;
  }

  create(id, total, options = {}) {
    const bar = new TestProgressBar(total, {
      ...options,
      stream: { 
        write: () => {}, 
        clearLine: () => {}, 
        cursorTo: () => {} 
      }
    });
    
    this.bars.set(id, {
      bar,
      line: this.bars.size
    });

    return bar;
  }

  render() {
    if (this.rendering) return;
    this.rendering = true;

    // Move cursor to top of progress area
    process.stdout.moveCursor(0, -(this.bars.size - 1));

    for (const [id, { bar, line }] of this.bars) {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      
      // Manually render each bar
      const percent = Math.floor((bar.current / bar.total) * 100);
      const filledLength = Math.floor((bar.current / bar.total) * bar.barLength);
      const emptyLength = bar.barLength - filledLength;
      
      const barStr = bar.complete.repeat(filledLength) + bar.incomplete.repeat(emptyLength);
      const output = `${id}: ${barStr} ${percent}% ${bar.currentMessage}`;
      
      process.stdout.write(output);
      
      if (line < this.bars.size - 1) {
        process.stdout.write('\n');
      }
    }

    this.rendering = false;
  }

  complete() {
    process.stdout.write('\n');
  }
}

module.exports = { TestProgressBar, MultiProgressBar };
