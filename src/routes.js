const routes = require("@socialgouv/next-routes");

module.exports = routes()
  .add("collection", "/bucket/:bucket/collection/:collection", "collection")
  .add(
    "record",
    "/bucket/:bucket/collection/:collection/record/:record",
    "record"
  )
  .add("bucket", "/bucket/:bucket", "bucket")
  .add("index", "/");
