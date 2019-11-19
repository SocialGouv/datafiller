const data = require("../src/dump.data2.json");

const fichesMT = data.filter(rec => rec.source === "fiches_ministere_travail");
const fichesSP = data.filter(rec => rec.source === "fiches_service_public");
const themes = data.filter(rec => rec.source === "themes");
const modeles = data.filter(rec => rec.source === "modeles_de_courriers");

const fixUrl = url => {
  if (url.match(/^https?:\/\//)) {
    if (
      url.includes("code.travail.gouv.fr") ||
      url.includes("code-du-travail-numerique")
    ) {
      const relativeUrl = url.replace(/^https?:\/\/[^/]+(?:\/(.*))?/, "/$1");
      console.log(`Fixed relative url in CDTN link`, url, relativeUrl);
      return relativeUrl;
    }
    return url;
  }
  if (url.match(/^\/code-du-travail\//)) {
    return url;
  }
  if (url.match(/^\/outils\//)) {
    return url;
  }
  const modeleMatch = url.match(/^\/modeles-de-courriers\/([^/#]+)/);
  if (modeleMatch) {
    const found = modeles.find(fiche => fiche.slug === modeleMatch[1]);
    if (found) {
      return url;
    }
    return false;
  }

  const modeleMatch2 = url.match(/^\/modeles_de_courriers\/([^/#]+)/);
  if (modeleMatch2) {
    const found = modeles.find(fiche => fiche.slug === modeleMatch2[1]);
    if (found) {
      const fixedUrl = url.replace(
        "modeles_de_courriers",
        "modeles-de-courriers"
      );
      console.log("Fixed", url, fixedUrl);
      return fixedUrl;
    }
    return false;
  }

  const ficheMinTMatch = url.match(/^\/fiche-ministere-travail\/([^/#]+)/);
  if (ficheMinTMatch) {
    const slug = ficheMinTMatch[1];
    const fullSlug = url.match(/^\/fiche-ministere-travail\/(.*)/)[1];
    const fixSlug = slug =>
      slug
        .replace(/# t[12345]-/, "#")
        .replace("#", "-")
        .replace(/-039-/, "")
        .toLowerCase();
    const foundFiche = fichesMT.find(
      fiche => fixSlug(fiche.slug) === slug || fiche.slug === fullSlug
    );
    if (foundFiche) {
      console.log("Fixed", url, `/fiche-ministere-travail/${foundFiche.slug}`);
      return `/fiche-ministere-travail/${foundFiche.slug}`;
    }
    return false;
  }

  const ficheSpMatch = url.match(/^\/fiche-service-public\/([^/#]+)/);
  if (ficheSpMatch) {
    const slug = ficheSpMatch[1];
    const foundFiche = fichesSP.find(fiche => fiche.slug === slug);
    if (foundFiche) {
      return url;
    }
    return false;
  }
  const themeMatch = url.match(/^\/themes\/([^/#]+)/);
  if (themeMatch) {
    const slug = themeMatch[1];
    const found = themes.find(fiche => fiche.slug === slug);
    if (found) {
      return url;
    }
    return false;
  }

  return false;
};

module.exports = { fixUrl };
