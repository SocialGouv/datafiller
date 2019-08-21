import React from "react";

import KintoFetch from "./KintoFetch";

// cache by bucket + collection
// todo: update when some item change
const cache = {};

//  🌈 double render prop
// render prop that render with `result` from `collection.listRecords`
const ListRecords = ({ bucket, collection, render, sort = "title" }) => (
  <KintoFetch
    fetch={async ({ client }) => {
      const key = `${bucket}.${collection}`;
      if (!cache[key]) {
        cache[key] = await client
          .bucket(bucket, { headers: {} })
          .collection(collection, { headers: {} })
          .listRecords({ sort, headers: {} });
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
