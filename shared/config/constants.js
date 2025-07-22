const SERVICES = {
  USER_SERVICE: "user-service",
  AUTH_SERVICE: "auth-service",
  WEBHOOK_SERVICE: "webhook-service",
  PRODUCT_SERVICE: "product-service",
  ORDER_SERVICE: "order-service",
  CART_SERVICE: "cart-service",
  PAYMENT_SERVICE: "payment-service",
};

const PORTS = {
  API_GATEWAY: 3000,
  USER_SERVICE: 3001,
  AUTH_SERVICE: 3002,
  WEBHOOK_SERVICE: 3003,
  PRODUCT_SERVICE: 3004,
  ORDER_SERVICE: 3005,
  CART_SERVICE: 3006,
  PAYMENT_SERVICE: 3007,
};

const EVENTS = {
  USER: {
    CREATED: "user.created",
    UPDATED: "user.updated",
    DELETED: "user.deleted",
    LOGIN: "user.login",
    LOGOUT: "user.logout",
    PROFILE_UPDATED: "profile.updated",
    PASSWORD_CHANGED: "password.changed",
    EMAIL_VERIFIED: "email.verified",
    PHONE_VERIFIED: "phone.verified",
  },
  ORDER: {
    CREATED: "order.created",
    UPDATED: "order.updated",
    CANCELLED: "order.cancelled",
    SHIPPED: "order.shipped",
    DELIVERED: "order.delivered",
  },
  PAYMENT: {
    PROCESSED: "payment.processed",
    FAILED: "payment.failed",
    REFUNDED: "payment.refunded",
  },
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  LOCKED: 423,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

module.exports = {
  SERVICES,
  PORTS,
  EVENTS,
  HTTP_STATUS,
};
