import React from "react";
import Head from "next/head";

import Layout from "../../../../../../src/Layout";

import EditRecord from "../../../../../../src/EditRecord";

const RecordPage = props => {
  return (
    <Layout>
      <Head>
        <title>Dataset: {props.record}</title>
      </Head>
      <EditRecord {...props} />
    </Layout>
  );
};

RecordPage.getInitialProps = async ({ query }) => {
  return {
    bucket: query.bucket,
    collection: query.collection,
    record: query.record
  };
};

export default RecordPage; // () => <div>RecordPage</div>;
