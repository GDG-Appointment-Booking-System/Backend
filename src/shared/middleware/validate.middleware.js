import { AppError } from "../utils/helpers.js";

export const validate =
  (schema, source = "body") =>
  (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const issues = result.error.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return next(new AppError("Validation failed", 400, true, issues));
    }
    req[source] = result.data;
    next();
  };
