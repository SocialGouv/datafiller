import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { PlusSquare, Home } from "react-feather";
import Link from "next/link";

import ListRecords from "../src/kinto/ListRecords";
import KintoContext from "./kinto/KintoContext";
import ThemeLink from "./ThemeLink";

const getBgColor = item => {
  if (item.refs && item.refs.filter(i => !!i.url).length > 0) {
    return "#d2ff8d";
  }
  return "transparent";
};

const renderChildren = ({
  parent,
  themes,
  record,
  collection,
  bucket,
  depth = 0
}) => {
  return themes
    .filter(t => t.parent === parent)
    .sort((a, b) => {
      if (a.position < b.position) {
        return -1;
      }
      if (a.position > b.position) {
        return 1;
      }
      return 0;
    })
    .map(item => (
      <React.Fragment key={item.id}>
        <ListGroupItem
          action
          active={item.id === record}
          title={item.title}
          style={{
            paddingLeft: 20 * (depth + 1),
            backgroundColor: item.id !== record && getBgColor(item)
          }}
        >
          <ThemeLink
            bucket={bucket}
            collection={collection}
            item={item}
            record={record}
            focus={item.id === record}
          />
        </ListGroupItem>
        {renderChildren({
          parent: item.id,
          themes,
          record,
          collection,
          bucket,
          depth: depth + 1
        })}
      </React.Fragment>
    ));
};

const TreeRecordsView = ({ bucket, collection, record, onAddClick }) => (
  <ListRecords
    bucket={bucket}
    collection={collection}
    render={({ result }) => {
      const themes = result.data;
      return (
        <ListGroup
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            position: "absolute"
          }}
        >
          <ListGroupItem action style={{ flex: "0 0 auto" }}>
            <Link href="/" passHref>
              <a>
                <Home style={{ marginRight: 5, verticalAlign: "middle" }} />{" "}
                Accueil
              </a>
            </Link>
          </ListGroupItem>
          <ListGroupItem style={{ flex: "0 0 auto" }}>
            <KintoContext.Consumer>
              {({ client }) => (
                <a href="#" onClick={() => onAddClick({ client })}>
                  <PlusSquare
                    style={{ marginRight: 5, verticalAlign: "middle" }}
                  />
                  Ajouter une entrée
                </a>
              )}
            </KintoContext.Consumer>
          </ListGroupItem>
          <div style={{ overflow: "scroll" }}>
            {renderChildren({
              parent: null,
              record,
              bucket,
              collection,
              themes
            })}
          </div>
        </ListGroup>
      );
    }}
  />
);

export default TreeRecordsView;
