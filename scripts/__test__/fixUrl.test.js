const { fixUrl } = require("../fixUrl");

jest.mock(
  "../../src/dump.data.json",
  () => [
    { source: "modeles_de_courriers", slug: "modele-valide" },
    { source: "fiches_ministere_travail", slug: "fiche-mt-valide#Anchor" },
    { source: "fiches_service_public", slug: "fiche-sp-valide" },
    { source: "themes", slug: "theme-valide" }
  ],
  { virtual: true }
);

test("url should not be fixed", () => {
  expect(fixUrl("http://www.test.fr")).toEqual("http://www.test.fr");
});

test("local url should be fixed", () => {
  expect(fixUrl("http://code.travail.gouv.fr/fiche")).toEqual("/fiche");
});

test("local url should be fixed 2 ", () => {
  expect(fixUrl("http://code.travail.gouv.fr/fiche/test")).toEqual(
    "/fiche/test"
  );
});

test("local url should be fixed 3", () => {
  expect(
    fixUrl("http://test.code-du-travail-numerique.test/fiche/test")
  ).toEqual("/fiche/test");
});

test("local url should be fixed 4", () => {
  expect(fixUrl("http://test.code-du-travail-numerique.test")).toEqual("/");
});

test("modele url is valid", () => {
  expect(fixUrl("/modeles-de-courriers/modele-valide")).toEqual(
    "/modeles-de-courriers/modele-valide"
  );
});

test("modele invalid url should be detected", () => {
  expect(fixUrl("/modeles-de-courriers/modele-invalide")).toEqual(false);
});

test("modele url should be fixed", () => {
  expect(fixUrl("/modeles_de_courriers/modele-valide")).toEqual(
    "/modeles-de-courriers/modele-valide"
  );
});

test("fiche-mt url is valid", () => {
  expect(fixUrl("/fiche-ministere-travail/fiche-mt-valide#Anchor")).toEqual(
    "/fiche-ministere-travail/fiche-mt-valide#Anchor"
  );
});

test("fiche-mt url should be fixed", () => {
  expect(fixUrl("/fiche-ministere-travail/fiche-mt-valide-anchor")).toEqual(
    "/fiche-ministere-travail/fiche-mt-valide#Anchor"
  );
});

test("fiche-mt invalid url should be detected", () => {
  expect(fixUrl("/fiche-ministere-travail/fiche-invalide")).toEqual(false);
});

test("fiche-sp url is valid", () => {
  expect(fixUrl("/fiche-service-public/fiche-sp-valide")).toEqual(
    "/fiche-service-public/fiche-sp-valide"
  );
});

test("fiche-sp invalid url should be detected", () => {
  expect(fixUrl("/fiche-service-public/fiche-invalide")).toEqual(false);
});

test("theme url is valid", () => {
  expect(fixUrl("/themes/theme-valide")).toEqual("/themes/theme-valide");
});

test("theme invalid url should be detected", () => {
  expect(fixUrl("/themes/theme-invalide")).toEqual(false);
});
