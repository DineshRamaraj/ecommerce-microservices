const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger");

const requestTracking = (req, res, next) => {
  const startTime = Date.now();
  const requestId = uuidv4();

  // Add request ID to request and response
  req.requestId = requestId;
  res.setHeader("X-Request-ID", requestId);

  // Log request
  logger.info(`📥 Incoming Request`, {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    service: req.serviceInfo?.name,
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function (data) {
    const responseTime = Date.now() - startTime;

    logger.info(`📤 Response Sent`, {
      requestId,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      success: res.statusCode < 400,
    });

    return originalJson.call(this, data);
  };

  next();
};

module.exports = requestTracking;
