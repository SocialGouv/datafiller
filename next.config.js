module.exports = {
  useFileSystemPublicRoutes: false,
  publicRuntimeConfig: {
    API_URL: process.env.API_URL || "http://127.0.0.1:8888/v1",
    PACKAGE_VERSION: require("./package.json").version,
    KINTO_BUCKET: "datasets"
  }
};
