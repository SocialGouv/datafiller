import React from "react";
import getConfig from "next/config";

import { Link } from "../src/routes";
import ListCollections from "../src/kinto/ListCollections";

const { publicRuntimeConfig } = getConfig();

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

// Index.getInitialProps = async ({ query }) => {
//   return {};
// };

// by default we list the process.env.KINTO_BUCKET
class Home extends React.Component {
  static async getInitialProps({ query }) {
    const results = [];
    //getData(query.query).children || [];
    return { query: query.query, results };
  }
  render() {
    const { query, results } = this.props;
    const bucket = publicRuntimeConfig.KINTO_BUCKET;
    return (
      <ListCollections
        bucket={bucket}
        render={({ result }) => (
          <BucketView bucket={bucket} collections={result.data} />
        )}
      />
    );
  }
}

export default Home;
