import dotenv from "dotenv";
import { redisClient } from "../redis/client";
import { createClient } from "redis";



const notification_channel = "notifications";
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

export interface NotificationPlayload{
    id:string,
    title:string,
    message:string,
    createdAt:string
}

export async function publishNotification(notification:NotificationPlayload): Promise<void>{
    await redisClient.publish(notification_channel, JSON.stringify(notification));
}

const subscriberClient = createClient({url:redisUrl});


subscriberClient.on("error",(err)=>{
    console.error("subs redis error", err)
});

export async function startNotificationSubscriber()
{
    await subscriberClient.connect();

    await subscriberClient.subscribe(notification_channel,(message)=>{
        try {
             const notification = JSON.parse(message) as NotificationPlayload;
             console.log("new notification received");
             console.log("title", notification.title);
             console.log("title", notification.message);
             console.log("title", notification.id);
             console.log("title", notification.createdAt);
        } catch {
            console.log("new notification received ", message);
        }
    })
}
    startNotificationSubscriber().catch(err=>{
        console.error("start notification failed", err);
        process.exit(1);
    })
