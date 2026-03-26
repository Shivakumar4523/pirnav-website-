import jwt from "jsonwebtoken";

export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const secret = process.env.ADMIN_JWT_SECRET || "dev-secret-change-me";
    const payload = jwt.verify(token, secret);

    req.admin = {
      id: payload.sub,
      email: payload.email,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

