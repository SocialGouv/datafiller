import React from "react";
import Link from "next/link";
import { ListGroup, ListGroupItem } from "reactstrap";
import { PlusSquare, Home } from "react-feather";

import ListRecords from "../src/kinto/ListRecords";

import KintoContext from "./kinto/KintoContext";
import ThemeLink from "./ThemeLink";

const getBgColor = item => {
  if (item.refs && item.refs.filter(i => !!i.url).length > 0) {
    if (item.theme) {
      return "#d2ff8d";
    }
    return "#edffd1";
  } else if (item.theme) {
    return "#edffd1";
  }
  return "transparent";
};

const ListRecordsView = ({ bucket, collection, record, onAddClick }) => (
  <ListRecords
    bucket={bucket}
    collection={collection}
    render={({ result }) => (
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

          {(collection === "requetes" && (
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
          )) ||
            null}
          <div style={{ overflow: "scroll", height: "100vh" }}>
            {result.data.map(item => (
              <ListGroupItem
                action
                active={item.id === record}
                title={item.title}
                key={item.id}
                style={{
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
            ))}
          </div>
        </ListGroup>
      </React.Fragment>
    )}
  />
);

export default ListRecordsView;
