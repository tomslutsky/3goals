/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const { flatRoutes } = require("remix-flat-routes");

module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
};
