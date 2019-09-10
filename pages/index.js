import React from "react";
import getConfig from "next/config";
import Link from "next/link";

import ListCollections from "../src/kinto/ListCollections";
import KintoFetch from "../src/kinto/KintoFetch";

import { Eye, Database } from "react-feather";

import {
  Badge,
  Card,
  CardText,
  CardBody,
  CardTitle,
  Jumbotron,
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

const LastEntryButton = ({ bucket, collection }) => (
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
          <Link href={`/bucket/${bucket}/collection/${collection}`}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: 20 }}
            >
              <Eye style={{ marginRight: 5 }} /> Ouvrir
            </Button>
          </Link>
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
        <KintoFetch
          fetch={({ client }) =>
            client
              .bucket(bucket, { headers: {} })
              .collection(collection.id, { headers: {} })
              .listRecords({ headers: {} })
          }
          render={({ status, result }) => {
            return (
              status === "success" && (
                <CardBody>
                  <CardTitle style={{ fontSize: "1.5em" }}>
                    <RecordCount bucket={bucket} collection={collection.id} />
                    <Badge style={{ marginRight: 5 }} color="success">
                      {result.totalRecords}
                    </Badge>
                    {collection.id}
                  </CardTitle>
                  <CardText variant="subtitle1">
                    {collection.schema && collection.schema.title}
                  </CardText>
                  {result.data && result.data.length && (
                    <Link
                      href={`/bucket/${bucket}/collection/${collection.id}/record/${result.data[0].id}`}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: 20 }}
                      >
                        <Eye style={{ marginRight: 5 }} /> Ouvrir
                      </Button>
                    </Link>
                  )}
                </CardBody>
              )
            );
          }}
        />
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
      <Container>
        <Jumbotron>
          <h2 className="display-3">
            <Database
              style={{ marginRight: 5, verticalAlign: "bottom" }}
              size="1.35em"
            />{" "}
            Datafiller
          </h2>
          <p className="lead">
            Données de référence pour alimenter le moteur de recherche.
          </p>
        </Jumbotron>
        <ListCollections
          bucket={bucket}
          render={({ result }) => (
            <BucketView bucket={bucket} collections={result.data} />
          )}
        />
      </Container>
    );
  }
}

export default Home;
