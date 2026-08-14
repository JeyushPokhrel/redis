
//publish / subscriber
//publisher sends a message
//subscriber listen and receive a message
//channel is the topic name that both sides use

import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const channel = "demo:notifications";

async function run() {
    // needs two clients
    // one client will be to publish
    // second will be to subscribe


    const publisher = createClient({ url: redisUrl });
    const subscriber = createClient({ url: redisUrl });

    console.log("publisher and subscriber connected");
    console.log("PING", await publisher.ping());
    console.log("Subscirber listens");


    // subscriber must be active before publish 

    await subscriber.subscribe(channel, (message) => {
        const data = JSON.parse(message);
        console.log("subscriber received");
        console.log("Title", data.title);
        console.log("message", data.message);
    })
    console.log("subscribed to channel", channel);
    console.log("publisher is now sending event");

    const event = {
        title: "redis course",
        message: "pub/sub demo"
    }
    const receiver = await publisher.publish(channel, JSON.stringify(event));
    console.log("published event");
    console.log("active subscribers", receiver);

    await subscriber.unsubscribe(channel);
    await publisher.quit();
    await subscriber.quit();

    console.log("pub/sub demo done");

    run().catch((error) => {
        console.log("pub/sub demo failed", error);
        process.exit(1);
    })
}