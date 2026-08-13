import {Request, Response, NextFunction} from "express"
import { redisClient } from "../redis/client";
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX_REQUESTS = 5;

export async function productRateLimitter( req: Request,
    res: Response,
    next: NextFunction) {
   try {
    const ip = req.ip || "unknown";
    const rateLimiterKey = `rate_limit:products:${ip}`;

    const requestCount = await redisClient.incr(rateLimiterKey);

    if (requestCount === 1) {
        await redisClient.expire(rateLimiterKey, RATE_LIMIT_WINDOW_SECONDS)
    }
    res.setHeader("X-Rate-Limt-Limit",RATE_LIMIT_MAX_REQUESTS);
    res.setHeader("X-Rate-Limit-Remaining",
        Math.max(0, RATE_LIMIT_MAX_REQUESTS - requestCount )
    )
    if (requestCount > RATE_LIMIT_MAX_REQUESTS) {
        res.status(429).json({success:false,
            message: "Too many request please try again"
        });
    }
    next()
    
   } catch (error) {
    console.error("rate limit redis error", error);
    next(error);
   }
}