class Example {
  constructor(app, log) {
    this.app = app;// The app global.
    this.log = log;// The logger.
  }
}

module.exports = (app, log) => new Example(app, log);
