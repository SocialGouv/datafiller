const express = require("express");
var cacheManager = require("cache-manager");
var memoryCache = cacheManager.caching({
  store: "memory",
  max: 1000,
  ttl: 86400 /*1 day in seconds*/
});

var router = express.Router();

const { format, startOfDay, subMonths, subWeeks } = require("date-fns");

function getDate({ period = "month", previous = 1 } = {}) {
  if (period === "week") {
    return format(subWeeks(startOfDay(new Date()), previous), "yyyy-MM-dd");
  }
  return format(subMonths(startOfDay(new Date()), previous), "yyyy-MM-dd");
}

function buildUrl(params) {
  const qs = Object.entries(params).map(([key, value]) => `${key}=${value}`);
  return `https://matomo.fabrique.social.gouv.fr/index.php?${qs.join("&")}`;
}

/**
 * Input :
 [
   {
      "label": "/contribution",
      "subtable": [
        {
          "label": "/en-cas-de-perte-de-marche-par-lemployeur-quel...",
          "sum_daily_nb_uniq_visitors": 38,
          "url": "https://code.travail.gouv.fr/contribution/en-cas-..."
        },
        ...
      ]
    },
    ...
 ]

 * Output :
  [
    {
      "label": "/en-cas-de-perte-de-marche-par-lemployeur-quel...",
      "sum_daily_nb_uniq_visitors": 38,
      "url": "https://code.travail.gouv.fr/contribution/en-cas-..."
    },
    ...
  ]
 
 */

function pickSources(data) {
  return data
    .find(rootPage => rootPage.label === "fiche-service-public")
    .subtable.concat(
      data.find(rootPage => rootPage.label === "fiche-ministere-travail")
        .subtable,
      data.find(rootPage => rootPage.label === "contribution").subtable
    )
    .filter(candidate => candidate.label !== "Others");
}

const params = {
  module: "API",
  format: "Json",
  idSite: 4,
  method: "Actions.getPageUrls",
  expanded: 1
};

async function getPopulars(period) {
  const [data, previousPeriodData] = await Promise.all([
    fetch(
      buildUrl({ ...params, period, date: getDate({ period }) })
    ).then(data => data.json()),
    fetch(
      buildUrl({
        ...params,
        period,
        date: getDate({ period, previous: 2 })
      })
    ).then(data => data.json())
  ]);

  const candidates = pickSources(data);
  const previousCandidates = pickSources(previousPeriodData);

  const poundedCandidates = candidates.map(
    ({ label, sum_daily_nb_uniq_visitors: currentViews, url }) => {
      const { sum_daily_nb_uniq_visitors: previousViews } =
        previousCandidates.find(
          previousCandidate => previousCandidate.url === url
        ) || {};

      const growth = currentViews / previousViews;
      // Growth is twice more important than views
      const score = growth * currentViews;

      return {
        growth: Number.isNaN(growth) ? "-" : growth.toFixed(2),
        label,
        score: Number.isNaN(score) ? "-" : score.toFixed(2),
        url,
        views: currentViews
      };
    }
  );
  poundedCandidates.sort((a, b) => b.score - a.score);
  return poundedCandidates.slice(0, 20);
}

router.get("/populars", async (req, res) => {
  const monthlyPopulars = await memoryCache.wrap("month", function() {
    return getPopulars("month");
  });
  const weeklyPopulars = await memoryCache.wrap("week", function() {
    return getPopulars("week");
  });
  res.status(200).json({ month: monthlyPopulars, week: weeklyPopulars });
});

module.exports = router;
