const express = require("express");
const next = require("next");

const routes = require("./src/routes");

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handler = routes.getRequestHandler(app);

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  express()
    // next-routes handler
    .use(handler)
    .listen(PORT);
});
