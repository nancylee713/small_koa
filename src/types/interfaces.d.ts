export interface IConfig {
  port: string;
  redis: {
    host: string;
    port: number;
  }
}

export interface IStorage {
  get: (list: string) => Promise<string[]>;
  add: (list: string, item: string) => Promise<boolean>;
  remove: (list: string, item: string) => Promise<boolean>;
}