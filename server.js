const express = require("express");
const proxyMiddleware = require("http-proxy-middleware");
const next = require("next");

const api = require("./api");

//const routes = require("./src/routes");

// in prod, proxify the KINTO API at /kinto
const kintoProxy = {
  target: process.env.KINTO_URL_SERVER || "http://kinto:8888",
  pathRewrite: { "^/kinto": "" },
  changeOrigin: true
};

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();
  const { Sentry } = require("./sentry")(app.buildId);

  server
    .use(Sentry.Handlers.requestHandler())
    // setup a kinto proxy
    .use(proxyMiddleware("/kinto", kintoProxy))
    .use("/api", api)
    .get("*", (req, res) => {
      console.log("server handler", req.url);
      return handle(req, res);
    })
    .use(Sentry.Handlers.errorHandler());

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`> Proxify ${kintoProxy.target} at /kinto`);
  });
});
