const axios = require("axios");
const logger = require("./logger");

class HttpClient {
  constructor(baseURL, serviceSecret) {
    this.client = axios.create({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        "X-Service-Secret": serviceSecret,
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        config.metadata = { startTime: Date.now() };
        logger.info(
          `🔄 HTTP Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        logger.error("❌ HTTP Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const duration = Date.now() - response.config.metadata.startTime;
        logger.info(`✅ HTTP Response: ${response.status} - ${duration}ms`);
        return response;
      },
      (error) => {
        const duration = error.config?.metadata
          ? Date.now() - error.config.metadata.startTime
          : 0;
        logger.error(
          `❌ HTTP Error: ${
            error.response?.status || "Network"
          } - ${duration}ms`
        );
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data = {}, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }

  // Service-to-service communication with user context
  async callWithUser(method, url, data = {}, userId = null) {
    const config = {};
    if (userId) {
      config.headers = { "X-User-ID": userId };
    }

    return await this[method](url, data, config);
  }
}

module.exports = HttpClient;
