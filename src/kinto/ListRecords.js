import React from "react";

import KintoFetch from "./KintoFetch";

const ListRecords = ({ bucket, collection, render }) => (
  <KintoFetch
    fetch={({ client }) =>
      client
        .bucket(bucket)
        .collection(collection)
        .listRecords()
    }
    render={({ status, result }) => (
      <React.Fragment>
        {status === "error" && (
          <div>error fetching bucket {bucket} collections</div>
        )}
        {status === "success" &&
          render({
            result
          })}
      </React.Fragment>
    )}
  />
);

export default ListRecords;
