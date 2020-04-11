import React from "react";
import getConfig from "next/config";
import Link from "next/link";

import ProgressIndicator from "../src/forms/components/ProgressIndicator";
import sortByKey from "../src/sortByKey";
import getScore from "../src/getScore";
import getClient from "../src/kinto/client";
import { themableRoutes } from "../src/sources";
import { getSitemapUrls, slugify, matchSource } from "../src/cdtn-sitemap";
import { getThemes, hasTheme } from "../src/kinto/getThemes";
import { Eye, Database, Plus, Star } from "react-feather";

import {
  Badge,
  ListGroup,
  ListGroupItem,
  Card,
  CardText,
  CardBody,
  Jumbotron,
  Container,
  Button,
  Row,
  Col,
  Table,
  Progress
} from "reactstrap";

const { publicRuntimeConfig } = getConfig();

// remove duplicates (ex: splitted content)
const uniquify = arr => Array.from(new Set(arr));

const BucketIntro = ({ count }) => (
  <Jumbotron>
    <h2 className="display-3">
      <Database
        style={{ marginRight: 5, verticalAlign: "bottom" }}
        size="1.35em"
      />{" "}
      Datafiller
      <div
        style={{ fontSize: "1.5rem", display: "inline-block", marginLeft: 10 }}
      >
        {count}
        <Star fill="yellow" size={24} style={{ marginLeft: 5 }} />
      </div>
    </h2>
    <p className="lead">
      Données de référence pour alimenter le moteur de recherche.
    </p>
  </Jumbotron>
);

const sum = arr => arr.reduce((a, c) => a + c, 0);

const ButtonRecord = ({ bucket, collection, record, text, Icon }) => (
  <Link href={`/bucket/${bucket}/collection/${collection}/record/${record}`}>
    <Button variant="contained" color="primary">
      {Icon && <Icon style={{ marginRight: 10 }} />}
      {text}
    </Button>
  </Link>
);

const BucketView = ({ bucket, collections = [], themes }) => {
  return (
    <Container>
      <Row>
        <Col xs={12} sm={6} key="themes">
          <Card style={{ marginTop: 15 }}>
            <CardBody>
              <div style={{ fontSize: "1.5em", marginBottom: 35 }}>
                ⚠️{" "}
                <Link href={`/errors`} as={`/errors`} passHref>
                  <a>Références incorrectes</a>
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
        {collections.map(collection => {
          const lastRecords = collection.records
            .filter(r => !!r.title)
            .sort(sortByKey(r => -r.last_modified))
            .slice(0, 5);
          const lastRecord = lastRecords.length && lastRecords[0];
          return (
            <Col xs={12} sm={6} key={collection.id}>
              <Card style={{ marginTop: 15 }}>
                <CardBody>
                  <Row>
                    <Col xs={8} style={{ fontSize: "1.5em" }}>
                      {collection.id}
                      <Badge
                        style={{ marginLeft: 15, display: "inline" }}
                        color="success"
                      >
                        {collection.records.length}
                      </Badge>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                      {(lastRecord && (
                        <ButtonRecord
                          bucket={bucket}
                          collection={collection.id}
                          record={lastRecord.id}
                          Icon={Eye}
                          text="Ouvrir"
                        />
                      )) || (
                        <ButtonRecord
                          bucket={bucket}
                          collection={collection.id}
                          Icon={Plus}
                          record="new"
                          text="Ajouter"
                        />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <CardText variant="subtitle1">
                        {collection.schema && collection.schema.title}
                      </CardText>
                    </Col>
                  </Row>
                  <ListGroup flush style={{ marginTop: 30 }}>
                    {lastRecords.map(rec => (
                      <Link
                        href={`/bucket/${bucket}/collection/${collection.id}/record/${rec.id}`}
                        key={rec.id}
                      >
                        <ListGroupItem
                          tag="a"
                          href="#"
                          title={rec.title}
                          style={{ padding: ".5rem 1.25rem" }}
                          className="text-truncate"
                        >
                          <ProgressIndicator
                            score={getScore(collection.id, rec)}
                          />
                          {rec.title}
                        </ListGroupItem>
                      </Link>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          );
        })}
        <Col xs={12} sm={6} key="themes">
          <Card style={{ marginTop: 15 }}>
            <CardBody>
              <div style={{ fontSize: "1.5em", marginBottom: 35 }}>
                Contenus à thémer
              </div>
              <Table>
                <tbody>
                  {themes
                    .filter(item => item.items.length)
                    .map(item => (
                      <tr key={item.source}>
                        <td>
                          <Link
                            href={`/themes/[source]`}
                            as={`/themes/${item.source}`}
                            passHref
                          >
                            <a>{item.source}</a>
                          </Link>
                        </td>
                        <td>
                          <div>
                            <Progress
                              value={
                                ((item.total - item.items.length) /
                                  item.total) *
                                100
                              }
                            >
                              {parseInt(
                                ((item.total - item.items.length) /
                                  item.total) *
                                  100
                              )}
                              %
                            </Progress>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// recap for dashboard
const fetchAllCollections = async () => {
  const client = getClient();
  const collectionList = await client
    .bucket("datasets", { headers: {} })
    .listCollections({ headers: {} });
  return await Promise.all(
    collectionList.data.map(collection =>
      client
        .bucket("datasets", { headers: {} })
        .collection(collection.id, { headers: {} })
        .listRecords({ limit: 1000 })
        .then(records => ({
          id: collection.id,
          records: records.data
        }))
    )
  );
};

const fetchRecapThemes = async () => {
  const themes = await getThemes();

  const cdtnContents = await getSitemapUrls();

  const hasNoTheme = url => !hasTheme(url, themes);

  const recap = themableRoutes.map(source => {
    // recap of unthemed content for each source
    const contents = uniquify(
      cdtnContents.filter(matchSource(source)).map(slugify)
    );
    return {
      source,
      total: contents.length,
      items: contents.filter(hasNoTheme)
    };
  });

  return recap;
};

export const getServerSideProps = async () => {
  const collections = await fetchAllCollections();
  const themes = await fetchRecapThemes();
  return { props: { collections, themes } };
};

// by default we list the process.env.KINTO_BUCKET
const Home = ({ collections, themes }) => {
  const bucket = publicRuntimeConfig.KINTO_BUCKET;
  const total = sum(collections.map(c => c.records.length));
  return (
    <Container>
      <BucketIntro count={total} />
      <BucketView bucket={bucket} collections={collections} themes={themes} />
    </Container>
  );
};

export default Home;
