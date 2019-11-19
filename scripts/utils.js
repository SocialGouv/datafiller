const fetch = require("node-fetch");

const DATAFILLER_URL = process.env.DATAFILLER_URL || `http://127.0.0.1:3003`;

const updateRecord = async (collection, id, data) => {
  console.log("updateRecord", id);
  await fetch(
    `${DATAFILLER_URL}/kinto/v1/buckets/datasets/collections/${collection}/records/${id}`,
    {
      method: "PATCH",
      headers: {
        //Authorization:
        //   "Basic " + Buffer.from("cdtn:givemedata").toString("base64"),
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data
      })
    }
  )
    .then(r => r.json())
    .then(d => d.data)
    .catch(console.log);
};

const getCollection = collection =>
  fetch(
    `${DATAFILLER_URL}/kinto/v1/buckets/datasets/collections/${collection}/records`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }
  )
    .then(r => r.json())
    .then(json => json.data);

module.exports = {
  updateRecord,
  getCollection
};
