const express = require("express");
const proxyMiddleware = require("http-proxy-middleware");
const next = require("next");

//const routes = require("./src/routes");

// in prod, proxify the KINTO API at /kinto
const kintoProxy = {
  target: "http://kinto:8888",
  pathRewrite: { "^/kinto": "" },
  changeOrigin: true
};

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = express();

  // setup a kinto proxy
  server.use(proxyMiddleware("/kinto", kintoProxy));

  server.get("/api/ccn/:ccn.json", async (req, res) => {
    if (req.params.ccn.match(/^KALICONT/)) {
      const ccn = require(`@socialgouv/kali-data/data/${req.params.ccn}.json`);
      res.json(ccn);
    }
    res.status(404).end();
  });

  server.get("*", (req, res) => {
    handle(req, res);
  });

  server.listen(PORT, err => {
    if (err) {
      throw err;
    }
    console.log(`> Ready on port ${PORT} [${process.env.NODE_ENV}]`);
    console.log(`> Proxify ${process.env.KINTO_URL} at /kinto`);
  });
});
