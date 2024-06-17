module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/test/jest/**/*.ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  modulePathIgnorePatterns: ["<rootDir>/build/", "<rootDir>/node_modules/"],
  globalSetup: "<rootDir>/src/test/config/globalSetup.ts",
  globalTeardown: "<rootDir>/src/test/config/globalTeardown.ts",
};
