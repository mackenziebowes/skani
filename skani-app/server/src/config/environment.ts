import { $ } from "bun";

type CorsOptions = {
  origin: string[];
  allowHeaders?: string[];
  allowMethods?: string[];
  exposeHeaders?: string[];
  maxAge?: number;
  credentials?: boolean;
};

type Config = {
  cors: CorsOptions;
};

const LOCAL_CONFIG: Config = {
  cors: {
    origin: ["http://localhost:3000"],
    allowMethods: ["*"],
    maxAge: 600,
    credentials: true,
  },
};

const PRODUCTION_CONFIG: Config = {
  cors: {
    origin: ["*"],
    allowHeaders: ["*"],
    allowMethods: ["*"],
    maxAge: 600,
    credentials: true,
  },
};

export const getEnv = (): Config => {
  const ENV_ENVIRONMENT = process.env.ENVIRONMENT;
  switch (ENV_ENVIRONMENT) {
    case "PRODUCTION":
      return PRODUCTION_CONFIG;
    case "LOCAL":
    default:
      return LOCAL_CONFIG;
  }
};
