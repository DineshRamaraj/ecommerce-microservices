const logger = require("../utils/logger");

const serviceAuth = (allowedServices = []) => {
  return (req, res, next) => {
    const serviceSecret = req.headers["x-service-secret"];
    const serviceName = req.headers["x-service-name"];
    const expectedSecret =
      process.env.SERVICE_SECRET || "shared-microservice-secret";

    if (!serviceSecret || serviceSecret !== expectedSecret) {
      logger.warn(`🚫 Unauthorized service access attempt from: ${req.ip}`, {
        serviceName,
        headers: req.headers,
      });

      return res.status(401).json({
        success: false,
        message: "Unauthorized service access",
        code: "INVALID_SERVICE_SECRET",
      });
    }

    // Check if service is allowed (if specified)
    if (
      allowedServices.length > 0 &&
      serviceName &&
      !allowedServices.includes(serviceName)
    ) {
      logger.warn(`🚫 Service not allowed: ${serviceName}`, {
        allowedServices,
        requestedBy: serviceName,
      });

      return res.status(403).json({
        success: false,
        message: "Service not authorized for this endpoint",
        code: "SERVICE_NOT_ALLOWED",
      });
    }

    // Add service info to request
    req.serviceInfo = {
      name: serviceName,
      authenticated: true,
    };

    // Extract user ID if provided
    const userId = req.headers["x-user-id"];
    if (userId) {
      req.userId = userId;
    }

    logger.info(`✅ Service authenticated: ${serviceName || "unknown"}`);
    next();
  };
};

module.exports = serviceAuth;
