import React from "react";
import Head from "next/head";

import EditRecord from "../../../../../../src/EditRecord";
import Layout from "../../../../../../src/Layout";

import getClient from "../../../../../../src/kinto/client";

const RecordPage = props => {
  const { record, records, ...otherProps } = props;
  return (
    <div>
      <Head>
        <title>Dataset: {record.data.id}</title>
      </Head>
      <Layout records={records}>
        <EditRecord record={record} {...otherProps} />
      </Layout>
    </div>
  );
};

const sortByKey = getter => (a, b) => {
  if (getter(a) < getter(b)) {
    return -1;
  } else if (getter(a) > getter(b)) {
    return 1;
  }
  return 0;
};

RecordPage.getInitialProps = async ({ query }) => {
  const client = getClient();
  const recordsQuery = await client
    .bucket(query.bucket, { headers: {} })
    .collection(query.collection, { headers: {} })
    .listRecords({ limit: 1000 });
  const records = recordsQuery.data.sort(
    sortByKey(r => r.title.trim().toLowerCase())
  );
  let record;
  try {
    record = await client
      .bucket(query.bucket, { headers: {} })
      .collection(query.collection, { headers: {} })
      .getRecord(query.record, { headers: {} });
  } catch (e) {
    console.log("e", e);
    throw e;
  }
  return {
    record,
    records,
    query
  };
};

export default RecordPage; // () => <div>RecordPage</div>;
