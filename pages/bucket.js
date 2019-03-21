import React from "react";

import { Link } from "../src/routes";
import KintoFetch from "../src/kinto/KintoFetch";

const BucketView = ({ bucket, collections = [] }) => (
  <ul>
    {collections.map(collection => (
      <li key={collection.id}>
        <Link
          key={collection.id}
          to="collection"
          params={{ bucket, collection: collection.id }}
        >
          <a>{collection.id}</a>
        </Link>
      </li>
    ))}
  </ul>
);

const Bucket = ({ bucket }) => (
  <KintoFetch
    fetch={({ client }) => client.bucket(bucket).listCollections()}
    render={({ status, result }) => (
      <React.Fragment>
        {status === "error" && <div>error</div>}
        {status === "success" && (
          <BucketView bucket={bucket} collections={result.data} />
        )}
      </React.Fragment>
    )}
  />
);

Bucket.getInitialProps = async ({ query }) => {
  return { bucket: query.bucket };
};

export default Bucket;
