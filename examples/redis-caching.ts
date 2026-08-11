
import {createClient} from "redis";
import dotenv from "dotenv";

dotenv.config();
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = createClient({url : redisUrl});

// cache key there

const cacheKey = "demo:product";
const cacheTtlSeconds = 60;

let dbProducts = ["Keyboard", "Mouse", "Laptop"];

async function run(){

    await redis.connect();

    //first request -> cache miss 

    let cached = await redis.get(cacheKey);

    // cache aside pattern 
    if (cached) {
        console.log("cache HIT");
        console.log("data", JSON.parse(cached));
    }
    else{

        console.log("Cache MisS")
        // read from main db 

        const products = dbProducts;

        // set/save the products in redis cache
        // setEx -> also saves ttl which result in it does not live forever
        await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(products));
    }
    //stale cache problem 

    dbProducts = ["Keyboard", "Mouse", "Laptop", "Desktop"];
    console.log(dbProducts,"dbProducts");

    cached = await redis.get(cacheKey);
    console.log("cached Data ", JSON.parse(cached!))


    // cache invalidation 
    // when DB changes -> needs to delete the old cache 

    await redis.del(cacheKey);
    console.log("Cache delted");

    if(!cached){
        const freshProducts = dbProducts;

        await redis.setEx(cacheKey, cacheTtlSeconds, JSON.stringify(freshProducts));
        console.log("fresh data",freshProducts);
    }
    await redis.quit();
    
}
run().catch((error)=>{
    console.log("error:",error);
    
})