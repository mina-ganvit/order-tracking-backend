import { createClient } from "redis";

const redis = createClient({
  url: "redis://127.0.0.1:6379",
});

// connect once when app starts
// redis.connect().catch(console.error);
// connect once when app starts

export default redis;
