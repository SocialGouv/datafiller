const routes = require("next-routes");

module.exports = routes()
  .add({
    name: "query",
    pattern: "/query/:query",
    page: "query"
  })
  .add({ name: "index", pattern: "/", page: "index" });
