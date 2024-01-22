class ApiError {
  constructor(statusCode, success = false, errorMessage) {
    this.statusCode = statusCode;
    this.success = success;
    this.errorMessage = errorMessage;
  }
}

export default ApiError;
