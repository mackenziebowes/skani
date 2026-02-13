import ROOT_APP from "./root";
const PORT = process.env.PORT ?? 3050;

export default {
  port: PORT,
  fetch: ROOT_APP.fetch,
};
