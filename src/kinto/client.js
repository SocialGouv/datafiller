// use require for calls from server.js
const getConfig = require("next/config").default;
const KintoClient = require("kinto-http");

const { publicRuntimeConfig } = getConfig();

const KINTO_URL = publicRuntimeConfig.KINTO_URL;

const kintoClient = new KintoClient(KINTO_URL);

module.exports = kintoClient;
