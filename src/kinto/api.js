export default {
  updateRecord: ({ bucket, collection, record, data }) =>
    client
      .bucket(bucket)
      .collection(collection)
      .updateRecord({ ...data, id: record })
      .then(console.log)
      .catch(console.log)
};
