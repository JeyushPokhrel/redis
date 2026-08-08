
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

//list 
//the redis list will be ordered collection of values
const listKey = "demo:messages";
await redis.lPush(listKey,"hello");
await redis.lPush(listKey, "learning list in redis");

//lRange reads the item from the list
//lTrim keeps only part of the list
const extractMessages  = await redis.lRange(listKey, 0, -1);
console.log(extractMessages);

//set -> sets unique   sets of unique value only

const setKey = "demo:tags"
await redis.sAdd(setKey,"nodejs");
await redis.sAdd(setKey,"nextjs");
await redis.sAdd(setKey,"nextjs");

const tagCount = await redis.sCard(setKey);
console.log(tagCount);

const rankKey = "demo:leaderboard"
//zAdd stores the member plus score 

await redis.zAdd(rankKey,{score:100,value:"player A"})
await redis.zAdd(rankKey,{score:200,value:"player B"})
//zIncrBy increases the value of a player A
const newScore = await redis.zIncrBy(rankKey,50,"player A");
console.log(newScore);

//zRevRank helps to sort the rank or helps in indentifying the  position of member 
const rank = await redis.zRevRank(rankKey,"player B");
console.log(rank);

//TTL Time To Leave ->it tells redis  how a particular key should exists before 
//     being deleted automatically
// key - a
// vlaue :345
// ttl : 300 seconds  and it shows the remaining time 
//              -before it's going to leave automatically 
// after 5 min redis is going to delte this key automatically 

const otpKey = "demo:otp";

await redis.set(otpKey, "123456");
await redis.expire(otpKey, 60);

const ttl = await redis.ttl(otpKey);
console.log(ttl);

await redis.quit();
}

run().catch((error)=>{
    console.error("demo fialed",error);
    process.exit(1);
});