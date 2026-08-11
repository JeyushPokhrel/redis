import {createClient} from "redis"

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

export const redisClient = createClient({url:redisUrl});

redisClient.on("connect",()=>{
    console.log("Redis client connected");
    
});

redisClient.on("ready",()=>{
    console.log("Redis client ready");
    
});

redisClient.on("error",(error)=>{
    console.log("Redis client error",error);
    
});

redisClient.on("end",()=>{
    console.log("Redis client connection closed");
    
});

// if redis is not open initially then it will 
export async function connectRedis(): Promise<void>{
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }

    // checking the response of redis after connection 
    const pong = await redisClient.ping();
    console.log("redis ping response", pong);
    
}

// if redis is already ready then quit or disconnect the connection 
export async function disconnectRedis(): Promise<void>{
    if (redisClient.isOpen) {
            await redisClient.quit();
    }
    
}

