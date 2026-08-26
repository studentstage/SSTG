const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const env = Object.freeze({
  apiUrl:
    configuredApiUrl || "https://student-stage-backend-apis.onrender.com/api",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
});
