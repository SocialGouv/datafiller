import React from "react";

import Typography from "@material-ui/core/Typography";

import withKinto from "./kinto/withKinto";
import KintoFetch from "./kinto/KintoFetch";
import { Router } from "./routes";

// todo: map kinto collections to components
const forms = {
  requetes: require("./forms/Dataset1").default
};

const onSubmit = ({ client, bucket, collection, data }) =>
  client
    .bucket(bucket)
    .collection(collection)
    .updateRecord({ ...data });

const onDelete = ({ client, bucket, collection, id }) =>
  client
    .bucket(bucket)
    .collection(collection)
    .deleteRecord(id);

const EditRecord = withKinto(({ client, bucket, collection, record }) => {
  // todo: use json-schema-form when no schema defined
  const Component = forms[collection];
  if (!Component) {
    throw new Error(
      `Cannot find editor component for collection ${collection}. Valid collections : ${Object.keys(
        forms
      ).join(", ")}`
    );
  }

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
                onDelete={() =>
                  onDelete({
                    client,
                    bucket,
                    collection,
                    id: result.data.id
                  }).then(() =>
                    Router.pushRoute("collection", { bucket, collection })
                  )
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
