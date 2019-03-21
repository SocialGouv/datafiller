import React from "react";

import KintoFetch from "./KintoFetch";

// cache by bucket+collection
const cache = {};

// render prop that render with `result` from `collection.listRecords`
const ListRecords = ({ bucket, collection, render }) => (
  <KintoFetch
    fetch={async ({ client }) => {
      const key = `${bucket}.${collection}`;
      if (!cache[key]) {
        cache[key] = await client
          .bucket(bucket)
          .collection(collection)
          .listRecords({ sort: "title" });
      }
      return cache[key];
    }}
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
