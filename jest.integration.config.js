const baseConfig = require("./jest.config");

module.exports = {
  ...baseConfig,
  testPathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/integration-test/**/*.test.[jt]s?(x)"]
};
