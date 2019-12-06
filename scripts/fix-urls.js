const { updateRecord, getCollection } = require("./utils");

const { fixUrl } = require("./fixUrl");

const isValidUrl = url => {
  if (!url) {
    return false;
  }
  if (url.match(/^\/question\//)) {
    return false;
  }
  return true;
};

// set valid flag and fix url on a bunch of references [{url}, {url}]
const fixRefs = refs =>
  refs
    .filter(ref => isValidUrl(ref.url))
    .map(ref => {
      const fixedUrl = fixUrl(ref.url);
      if (!fixedUrl) {
        return {
          ...ref,
          valid: false
        };
      }
      return {
        ...ref,
        url: fixedUrl,
        valid: true
      };
    })
    .reduce((acc, cur) => {
      // prevent doublons
      if (!acc.find(r => r.url === cur.url)) {
        acc.push(cur);
      }
      return acc;
    }, []);

const getAllRefs = records =>
  records.reduce((acc, record) => [...acc, ...record.refs], []);

// mark and fix all record.refs in a collection
const fixCollection = async collection => {
  const records = await getCollection(collection);

  const validRecords = await Promise.all(
    records
      .filter(req => req.refs && req.refs.length)
      .map(async record => {
        const newRefs = fixRefs(record.refs);
        newRefs
          .filter(ref => !ref.valid)
          .forEach(ref => {
            console.error(`Wrong url in ${collection} ${record.id}`, ref.url);
          });
        await updateRecord(collection, record.id, { refs: newRefs });
        return {
          ...record,
          refs: newRefs
        };
      })
  );
  const allRefs = getAllRefs(validRecords);
  console.log(
    `${collection} : ${allRefs.filter(r => !r.valid).length}/${
      allRefs.length
    } wrong references`
  );
};

fixCollection("requetes");
fixCollection("themes");
