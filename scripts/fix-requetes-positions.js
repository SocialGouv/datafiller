const { updateRecord, getCollection } = require("./utils");
const pAll = require("p-all");

const sourcesPriority = [
  "outils",
  "contribution",
  "modeles-de-courriers",
  "fiche-service-public",
  "fiche-ministere-travail",
  "code-du-travail",
  "external"
];

const getSource = url => {
  const source = url.match(/^\/([^/]+)\//);
  return (source && source[1]) || "external";
};

// if position no defined
// sort by relevance if any, then by source
const sortRefs = (a, b) => {
  if (a.position !== undefined && b.position !== undefined) {
    if (a.position > b.position) {
      return 1;
    } else if (a.position < b.position) {
      return -1;
    }
    return 0;
  }
  if (a.relevance !== undefined && b.relevance !== undefined) {
    if (a.relevance > b.relevance) {
      return -1;
    } else if (a.relevance < b.relevance) {
      return 1;
    }
  }
  // sort by source
  let sourceA = sourcesPriority.indexOf(getSource(a.url));
  let sourceB = sourcesPriority.indexOf(getSource(b.url));
  if (sourceA === -1) sourceA = 999;
  if (sourceB === -1) sourceB = 999;
  if (sourceA > sourceB) {
    return 1;
  } else if (sourceA < sourceB) {
    return -1;
  }
  return 0;
};

const refs1 = [
  {
    url: "",
    position: 5
  },
  { url: "", position: 3 },
  {
    url: "",
    position: 0
  },
  {
    url: "",
    title: "pouet"
  },
  {
    url: "/contribution/c3",
    title: "c3",
    relevance: 3
  },
  {
    url: "/code-du-travail/xxx",
    title: "pouet2",
    relevance: 3
  },
  {
    url: "/contribution/c1",
    title: "c1",
    relevance: 3
  },
  { url: "", position: 6 },
  { url: "/extra", relevance: 5 }
];

const setNaturalPosition = (item, i) => ({
  ...item,
  position: i + 1
});

refs1.sort(sortRefs);

console.log("refs1", refs1.map(setNaturalPosition));

process.exit(0);

const reorderPositions = refs =>
  refs.sort(sortRefs) && refs.map(setNaturalPosition);

// mark and fix all record.refs in a collection
const fixCollection = async collection => {
  const records = await getCollection(collection);

  const validRecords = await pAll(
    records
      .filter(req => req.refs && req.refs.length)
      .slice(0, 10)
      .map(record => () => {
        const newRefs = reorderPositions(record.refs);

        //console.log("io", record.refs, newRefs);

        console.table(newRefs);
        // return updateRecord(collection, record.id, { refs: newRefs }).then(
        //   () => ({
        //     ...record,
        //     refs: newRefs
        //   })
        // );
      }),
    { concurrency: 5 }
  );

  //const allRefs = getAllRefs(validRecords);
  // console.log(
  //   `\n## ${collection} : ${allRefs.filter(r => !r.valid).length}/${
  //     allRefs.length
  //   } wrong references\n`
  // );
};

fixCollection("requetes");
