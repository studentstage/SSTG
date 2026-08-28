import { env } from "../../config/env";

const DEMO_TOKEN = "student-stage-demo-session";

export const demoAuth = Object.freeze({
  enabled: env.isDevelopment && env.enableDemoAuth,
  token: DEMO_TOKEN,
  user: Object.freeze({
    id: "demo-student",
    username: "demo-student",
    role: "STUDENT",
  }),
});

export function isDemoToken(token) {
  return token === DEMO_TOKEN;
}
