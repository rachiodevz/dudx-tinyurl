import { log } from "../utils/logger.js";

export function requestLogger(req, res, next) {
  log(
    `${req.method} ${req.url} - User: ${req.user ? req.user.email : "anonymous"}`,
  );
  next();
}

export default { requestLogger };
