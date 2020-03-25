import getClient from "./client";

export const slugify = url =>
  url.replace(/^https?:\/\/[^/]+/, "").split("#")[0];

export const hasTheme = (url, themes) =>
  themes.data.find(
    theme =>
      theme.refs &&
      theme.refs
        .filter(ref => !!ref.url)
        .find(ref => slugify(ref.url) === slugify(url))
  );

export const getThemes = () =>
  getClient()
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .listRecords({ limit: 1000 });
