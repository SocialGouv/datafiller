const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  //useFileSystemPublicRoutes: false,
  publicRuntimeConfig: {
    KINTO_URL: process.env.KINTO_URL || "http://127.0.0.1:8888/v1",
    PACKAGE_VERSION: require("./package.json").version,
    KINTO_BUCKET: "datasets"
  }
});
