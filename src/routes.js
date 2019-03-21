const routes = require("@socialgouv/next-routes");

module.exports = routes()
  // .add({
  //   name: "query",
  //   pattern: "/query/:query",
  //   page: "query"
  // })
  // .add({ name: "index", pattern: "/", page: "index" });

  .add("collection", "/bucket/:bucket/collection/:collection", "collection")
  .add(
    "record",
    "/bucket/:bucket/collection/:collection/record/:record",
    "collection"
  )
  .add("bucket", "/bucket/:bucket", "bucket")
  .add("index", "/"); // about  about     /about
