import React from "react";
import getConfig from "next/config";

import { Link } from "../src/routes";
import ListCollections from "../src/kinto/ListCollections";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableFooter,
  TableBody,
  TableCell,
  IconButton
} from "@material-ui/core";

const { publicRuntimeConfig } = getConfig();

const BucketView = ({ bucket, collections = [] }) =>
  collections.map(collection => (
    <Card style={{ marginTop: 15 }}>
      <CardContent>
        <Typography variant="title">{collection.id}</Typography>
        <Link route="collection" params={{ bucket, collection: collection.id }}>
          <Button variant="contained" color="primary" style={{ topMargin: 15 }}>
            Ouvrir
          </Button>
        </Link>
      </CardContent>
    </Card>
  ));

// by default we list the process.env.KINTO_BUCKET
class Home extends React.Component {
  static async getInitialProps({ query }) {
    const results = [];
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
