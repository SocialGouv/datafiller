var express = require("express");
var ccn = require("./ccn");
var populars = require("./populars");

var router = express.Router();

router.use(ccn);
router.use(populars);

module.exports = router;
