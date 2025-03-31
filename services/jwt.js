import jwt from "jsonwebtoken";

import { JWT_PASSWORD } from "../config/jwt.config.js";

export function setUser(user) {
  // Full user object in payload after reduce the payload
  if (!user) {
    return null;
  }
  const payload = {
    id: user.id,
    role: user.role,
  };

  return jwt.sign(payload, JWT_PASSWORD, {
    expiresIn: "24h",
  });
}

export function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_PASSWORD);
  } catch (e) {
    return null;
  }
}

export async function generateResetToken(id, password) {
  if (!id || !password) return null;

  const payload = {
    id,
    hash: password,
  };

  return jwt.sign(payload, JWT_PASSWORD, {
    expiresIn: "15m",
  });
}

export async function verifyResetToken(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_PASSWORD);
  } catch (error) {
    return null;
  }
}
