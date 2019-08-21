import React from "react";
import Head from "next/head";

import EditRecord from "../../../../../../src/EditRecord";

const RecordPage = props => {
  return (
    <div>
      <Head>
        <title>Dataset: {props.record}</title>
      </Head>
      <EditRecord {...props} />
    </div>
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
