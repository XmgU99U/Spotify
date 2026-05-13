import { createClient, RedisClientType } from "redis";

class RedisClient {
  static redisClient: RedisClient = new RedisClient(); 
  client?: RedisClientType;
  constructor() {
    this.client = createClient();
    this.client!.on("error", (error) => {
      console.log(`REDIS ERROR: ${error}`);
    });
    this.client.on("connect", () => {
      console.log("CONNECTED TO REDIS SERVER");
    });
  }
  async connect(): Promise<void> {
    try {
      await this.client?.connect();
    } catch (e) {
      console.log(`REDIS CATCHED ERROR: ${e}`);
    }
  }
   
}

export default RedisClient.redisClient ; 
