import { ENV, getEnv } from "../utils/env";
import localConfig from "./local.json";
import testConfig from "./test.json";
import prodConfig from "./prod.json";

interface OpenAIConfig {
  models: string[];
}

interface AppConfig {
  openAI: OpenAIConfig;
}

function getConfig(): AppConfig {
  const env = getEnv()
  if (env === ENV.LOCAL) {
    return localConfig; 
  } else if (env === ENV.TEST) {
    return testConfig;
  } else if (env === ENV.PROD) {
    return prodConfig;
  } else {
    const _exhaustiveCheck: never = env;
  }
}
