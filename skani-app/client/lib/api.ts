import { getEnv } from "./config";
import { join } from "node:path";

type APIArgs = {
  route: string;
  resource?: "main";
};

export async function getAPI(args: APIArgs) {
  const env = getEnv();
  const resource = () => {
    if (args.resource == undefined || args.resource == "main") {
      return env.remote_resources.main;
    }
  };
  const res = await fetch(`${resource()}${join(args.route)}`);
  const data = await res.json();
  return data;
}
