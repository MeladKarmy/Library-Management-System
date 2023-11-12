const rateLimit = require("express-rate-limit");
class RateLimiter {
  constructor(windowMs, max) {
    this.limiter = rateLimit({
      windowMs: windowMs * 60 * 1000 || 15 * 60 * 1000,
      max: max || 3,
    });
  }

  getMiddleware() {
    return this.limiter;
  }
}

module.exports = RateLimiter;
