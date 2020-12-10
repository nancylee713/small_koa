import * as Interfaces from "../types/interfaces";
import { config } from "../config";
import redis from "redis";
const {promisify} = require('util');


export function redisStorage(): Interfaces.IStorage {
  
  const client = redis.createClient(config.redis);

  const rpush = promisify(client.rpush).bind(client);
  const lrem = promisify(client.lrem).bind(client);
  const lrange = promisify(client.lrange).bind(client);

  return {
    get: (list: string) => {
      return lrange(list, 0, -1).then((val: string[]) => val).catch((e: Error) => []);
    },
    add: (list: string, title: string) => {
      return rpush(list, title).then((val: number) => val > 0).catch((e: Error) => false);
    },
    remove: (list: string, title: string) => {
      return lrem(list, title).then((val: number) => val > 0).catch((e: Error) => false);
    }
  }
}