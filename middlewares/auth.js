import { getUser } from "../service/auth.js";

export function checkForAuthentication(req, res, next) {
  const tokenCookie = req.cookies?.authToken;
  req.user = null;

  if (!tokenCookie) {
    return next();
  }

  const token = tokenCookie;
  const user = getUser(token);
  req.user = user;
  return next();
}

// restict to array of roles
export function restrictToOnly(roles = []) {
  return function (req, res, next) {
    if (!req.user) {
      return null;
    }
    if (!roles.includes(req.user.role)) return res.end("UnAuthorised");

    return next();
  };
}
