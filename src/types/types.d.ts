export interface ServerConfig {
  host: string;
  port: number;
  password: string;
  webhook: string;
  econRegex: string;
}

export interface EconServers {
  servers: {
    [serverName: string]: ServerConfig;
  };
}
