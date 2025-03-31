import rateLimit from "express-rate-limit";

export const appLimiter = rateLimit({
    windowMs: 15*60*1000, // 15Min
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false
})
export const authLimiter = rateLimit({
    windowMs: 15*60*1000, // 15Min
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
})