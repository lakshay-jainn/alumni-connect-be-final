import jwt from "jsonwebtoken";

const SECRET = "pagalpanda123";

export function setUser(user) {
  // Full user object in payload after reduce the payload
  if (!user) {
    return null
  }
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, SECRET);
}

export function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}
