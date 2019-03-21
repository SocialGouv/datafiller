import React from "react";

import withKinto from "./kinto/withKinto";
import KintoFetch from "./kinto/KintoFetch";

// map kinto collections to components
const forms = {
  dataset1: require("./forms/Dataset1").default
};

const onSubmit = ({ client, bucket, collection, data }) =>
  client
    .bucket(bucket)
    .collection(collection)
    .updateRecord({ ...data });

const EditRecord = withKinto(({ client, bucket, collection, record }) => {
  // todo: use json-schema-form when no schema defined
  const Component = forms[collection];

  return (
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
              <Component
                data={result.data}
                onSubmit={data =>
                  onSubmit({ client, bucket, collection, data })
                }
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    />
  );
});

export default EditRecord;
