const LOCAL_CONFIG = {
  remote_resources: {
    main: "http://localhost:3050",
  },
};

const PRODUCTION_CONFIG = {
  remote_resources: {
    main: "",
  },
};

export const getEnv = () => {
  const ENV_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT;
  switch (ENV_ENVIRONMENT) {
    case "LOCAL":
      return LOCAL_CONFIG;
    case "PRODUCTION":
      return PRODUCTION_CONFIG;
    default:
      const MSG = "Unknown ENVIRONMENT env variable value.";
      console.error(MSG);
      throw new Error("Application Exiting.");
  }
};
