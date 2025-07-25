class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || "unknown",
    });
  }

  static error(
    res,
    message = "Internal Server Error",
    statusCode = 500,
    errors = null
  ) {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || "unknown",
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  static paginated(res, data, pagination, message = "Success") {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination,
      timestamp: new Date().toISOString(),
      service: process.env.SERVICE_NAME || "unknown",
    });
  }

  static serviceResponse(data, message = "Success", statusCode = 200) {
    return {
      success: statusCode < 400,
      message,
      data,
      statusCode,
      timestamp: new Date().toISOString(),
    };
  }
}

module.exports = ApiResponse;
