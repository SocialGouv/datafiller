import React from "react";
import Head from "next/head";

import KintoFetch from "../src/kinto/KintoFetch";

import EditRecord from "../src/EditRecord";

const RecordView = ({ bucket, collection, record }) => (
  <div>
    <pre
      dangerouslySetInnerHTML={{ __html: JSON.stringify(record, null, 2) }}
    />
  </div>
);

const Record = ({ client, bucket, collection, record, onSubmit }) => (
  <KintoFetch
    fetch={({ client }) =>
      client
        .bucket(bucket)
        .collection(collection)
        .getRecord(record)
    }
    render={({ status, result }) => (
      <React.Fragment>
        {status === "error" && <div>error</div>}
        {status === "success" && (
          <React.Fragment>
            <RecordView
              bucket={bucket}
              collection={collection}
              record={result.data}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  />
);

const RecordPage = props => {
  return (
    <React.Fragment>
      <Head>
        <title>Dataset: {props.record ? props.record : props.collection}</title>
      </Head>
      <EditRecord {...props} />;
    </React.Fragment>
  );
};

RecordPage.getInitialProps = async ({ query }) => {
  return {
    bucket: query.bucket,
    collection: query.collection,
    record: query.record
  };
};

export default RecordPage;
