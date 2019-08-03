const routeBySource = {
  faq: "question",
  code_bfc: "fiche-code-bfc",
  fiches_service_public: "fiche-service-public",
  fiches_ministere_travail: "fiche-ministere-travail",
  code_du_travail: "code-du-travail",
  conventions_collectives: "convention-collective",
  modeles_de_courriers: "modeles-de-courriers",
  themes: "themes",
  outils: "outils",
  idcc: "idcc",
  kali: "kali"
};

const getRowId = row =>
  row.source && row.slug
    ? `/${routeBySource[row.source] || row.source}/${row.slug}`
    : row.url;

export default getRowId;
