export const baseUrl =
  process.env.DOCKER === "true"
    ? "http://frontend:5173"
    : "http://localhost:5173";
