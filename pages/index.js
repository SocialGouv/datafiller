import React from "react";
import getConfig from "next/config";
import Link from "next/link";

import ListCollections from "../src/kinto/ListCollections";
import KintoFetch from "../src/kinto/KintoFetch";

import {
  Badge,
  Card,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Container,
  Button
} from "reactstrap";

const { publicRuntimeConfig } = getConfig();

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
        return (
          <Badge style={{ marginRight: 5 }} color="success">
            {result}
          </Badge>
        );
      }
      return null;
    }}
  />
);

const BucketView = ({ bucket, collections = [] }) => (
  <Container>
    {collections.map(collection => (
      <Card key={collection.id} style={{ marginTop: 15 }}>
        <CardBody>
          <CardTitle>
            <RecordCount bucket={bucket} collection={collection.id} />
            {collection.id}
          </CardTitle>
          <CardText variant="subtitle1">{collection.schema.title}</CardText>
          <Link href={`/bucket/${bucket}/collection/${collection.id}`}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              Ouvrir
            </Button>
          </Link>
        </CardBody>
      </Card>
    ))}
  </Container>
);

// by default we list the process.env.KINTO_BUCKET
class Home extends React.Component {
  static async getInitialProps({ query }) {
    const results = [];
    return { query: query.query, results };
  }
  render() {
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
