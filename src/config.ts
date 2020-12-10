import * as Interfaces from "../src/types/interfaces";

export const config: Interfaces.IConfig = {
  port: process.env.PORT || "7654",
  redis: {
    host: process.env.REDIS__HOST || "0.0.0.0",
    port: process.env.REDIS__PORT && parseInt(process.env.REDIS__PORT) || 6379
  }
}