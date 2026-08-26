export class AppError extends Error {
  constructor(message, { kind = "unknown", status = null, cause } = {}) {
    super(message);
    this.name = "AppError";
    this.kind = kind;
    this.status = status;
    this.cause = cause;
  }
}

export function normalizeApiError(error) {
  if (error?.name === "CanceledError" || error?.code === "ERR_CANCELED") {
    return new AppError("Request canceled", { kind: "canceled", cause: error });
  }
  if (!error?.response) {
    return new AppError(
      "The service is unavailable. Check your connection and try again.",
      {
        kind: error?.code === "ECONNABORTED" ? "timeout" : "network",
        cause: error,
      },
    );
  }
  const status = error.response.status;
  const kind =
    status === 401
      ? "authentication"
      : status === 403
        ? "authorization"
        : status >= 500
          ? "server"
          : "unknown";
  return new AppError("The request could not be completed.", {
    kind,
    status,
    cause: error,
  });
}
