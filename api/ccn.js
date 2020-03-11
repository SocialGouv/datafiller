const express = require("express");
var router = express.Router();

router.get("/ccn/:ccn.json", async (req, res) => {
  if (req.params.ccn.match(/^KALICONT/)) {
    const ccn = require(`@socialgouv/kali-data/data/${req.params.ccn}.json`);
    res.json(ccn);
  }
  res.status(404).end();
});

module.exports = router;
