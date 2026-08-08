
// string -> it stores one value under one key
// plain text, numbers stored as text, counters
// key -> page_vies
// value "100"

import dotenv from "dotenv"
import {createClient } from "redis";

dotenv.config()

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379"

const redis = createClient({url:redisUrl})

async function run(){
    //open connection 

    await redis.connect()
    console.log("connected to redis");
    console.log("ping:", await redis.ping());

    //string 

    const stringKey = "demo:page_views";

    // set method ? stores the particular value under the key name " string key "

    await redis.set(stringKey, "100");

    const pageviews =await redis.get(stringKey);
    console.log(pageviews);
    
// redis string can also work like counter 

 const afterIncr =await redis.incr(stringKey);
console.log(afterIncr);


//hash stroes many small fields under one key - small object or map inside redis
//key : keyname
//fields:
//name : jeyush
//email: jeyush@gmail.com

const hashkey = "demo:user:profile";

// hset store all the fields that we want to store in the hashkey constant
await redis.hSet(hashkey,{
    name:"Jeyush",
    city:"Baneshwor"

    
});
const extractProfileInfo = await redis.hGetAll(hashkey)
console.log(extractProfileInfo);


}

run().catch((error)=>{
    console.error("demo fialed",error);
    process.exit(1);
});