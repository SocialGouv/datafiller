import React from "react";
import Head from "next/head";

import EditRecord from "../../../../../../src/EditRecord";
import Layout from "../../../../../../src/Layout";

import client from "../../../../../../src/kinto/client";

const RecordPage = props => {
  return (
    <div>
      <Head>
        <title>Dataset: {props.record.id}</title>
      </Head>
      <Layout>
        <EditRecord {...props} />
      </Layout>
    </div>
  );
};

RecordPage.getInitialProps = async ({ query }) => {
  const record = await client
    .bucket(query.bucket, { headers: {} })
    .collection(query.collection, { headers: {} })
    .getRecord(query.record, { headers: {} });

  return {
    record,
    query
  };
};

export default RecordPage; // () => <div>RecordPage</div>;
