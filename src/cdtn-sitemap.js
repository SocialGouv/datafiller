import memoizee from "memoizee";

import { themableRoutes } from "./sources";

const httpPrefix = "https?://";

const CDTN_URL = "http://master-code-travail.dev.fabrique.social.gouv.fr"

export const slugify = url =>
  url.replace(/^https?:\/\/[^/]+/, "").split("#")[0];

// only theme themableRoutes content
const isThemableUrl = url => {
  let themable = false;
  themableRoutes.forEach(path => {
    if (
      !themable &&
      url.match(new RegExp(`^${httpPrefix}[^/]+/${path}/.*$`, "g"))
    ) {
      themable = true;
    }
  });
  return themable;
};

// remove duplicates (ex: splitted content)
const uniquify = arr => Array.from(new Set(arr));

export const matchSource = source => url =>
  url.match(new RegExp(`^${httpPrefix}[^/]+/${source}/`));

// extract all valid urls from sitemap
export const _getSitemapUrls = () =>
  fetch(`${CDTN_URL}/sitemap.xml`)
    .then(r => r.text())
    .then(text =>
      text
        .match(/<loc>[^<]+<\/loc>/gm)
        .map(
          url => url.replace("<loc>", "").replace("</loc>", "")
          // .replace(/^https:\/\/[^/]+(\/.*)$/, "$1")
        )
        .filter(isThemableUrl)
    )
    .then(uniquify);

export const getSitemapUrls = memoizee(_getSitemapUrls, {
  maxAge: 1000 * 60 * 10, // 10 minutes
  promise: true
});

export const isValidabledUrl = (url) =>
  url.match(/^\/fiche-ministere-travail\//) ||
  url.match(/^\/fiche-service-public\//) ||
  url.match(/^\/contribution\//) ||
  url.match(/^\/modeles-de-courriers\//);