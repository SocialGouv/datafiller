import React from "react";
import getConfig from "next/config";
import Link from "next/link";

//import { Link } from "../src/routes";
import ListCollections from "../src/kinto/ListCollections";
import KintoFetch from "../src/kinto/KintoFetch";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";

import { Card, CardContent } from "@material-ui/core";

const { publicRuntimeConfig } = getConfig();

// const StyledAvatar = withStyles(theme => ({
//   avatar: {
//     color: theme.palette.primary.contrastText,
//     backgroundColor: theme.palette.primary.light,
//     display: "inline",
//     padding: "5px 10px"
//   }
// }))(({ classes, ...props }) => (
//   <Avatar className={classes.avatar} {...props} />
// ));

const RecordCount = ({ bucket, collection }) => (
  <KintoFetch
    fetch={({ client }) =>
      client
        .bucket(bucket, { headers: {} })
        .collection(collection, { headers: {} })
        .getTotalRecords({ headers: {} })
    }
    render={({ status, result }) => {
      if (status === "success" && result) {
        return <Chip label={result} color="primary" />;
      }
      return null;
    }}
  />
);

const BucketView = ({ bucket, collections = [] }) =>
  collections.map(collection => (
    <Card key={collection.id} style={{ marginTop: 15 }}>
      <CardContent>
        <Typography variant="h6">
          {collection.id}{" "}
          <RecordCount bucket={bucket} collection={collection.id} />
        </Typography>
        <Typography variant="subtitle1">{collection.schema.title}</Typography>

        <Link href={`/bucket/${bucket}/collection/${collection.id}`}>
          <Button variant="contained" color="primary" style={{ marginTop: 20 }}>
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
