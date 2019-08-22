import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { PlusSquare, Home } from "react-feather";
import Link from "next/link";

import ListRecords from "../src/kinto/ListRecords";
import KintoContext from "./kinto/KintoContext";
import ThemeLink from "./ThemeLink";

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
            paddingLeft: 20 * (depth + 1)
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
        <React.Fragment>
          <ListGroup>
            <ListGroupItem action>
              <Link href="/" passHref>
                <a>
                  <Home style={{ marginRight: 5, verticalAlign: "middle" }} />{" "}
                  Accueil
                </a>
              </Link>
            </ListGroupItem>
            <ListGroupItem>
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
            <div style={{ overflow: "scroll", height: "100vh" }}>
              {renderChildren({
                parent: null,
                record,
                bucket,
                collection,
                themes
              })}
            </div>
          </ListGroup>
        </React.Fragment>
      );
    }}
  />
);

export default TreeRecordsView;
