export enum ENV {
  LOCAL,
  TEST,
  PROD,
}

export function getEnv() {
  if (process.env.NODE_ENV === "local") {
    return ENV.LOCAL;
  } else if (process.env.NODE_ENV === "test") {
    return ENV.TEST;
  } else {
    return ENV.PROD;
  }
}

export function isLocal() {
  return getEnv() === ENV.LOCAL;
}

export function isTest() {
  return getEnv() === ENV.TEST;
}

export function isProd() {
  return getEnv() === ENV.PROD;
}
