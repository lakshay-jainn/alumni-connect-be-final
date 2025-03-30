import {createClient} from "redis";

const redisClient = createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect()


