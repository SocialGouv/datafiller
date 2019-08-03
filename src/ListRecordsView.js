import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import ListRecords from "../src/kinto/ListRecords";

import { Button, ListGroup, ListGroupItem } from "reactstrap";

import { PlusSquare, Home } from "react-feather";

import KintoContext from "./kinto/KintoContext";

import Link from "next/link";

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

const ListRecordsView = ({ bucket, collection, record, intro, onAddClick }) => (
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
                <Link
                  // href="/bucket/[bucket]/collection/[collection]/record/[record]"
                  href={`/bucket/${bucket}/collection/${collection}/record/${
                    item.id
                  }`}
                  passHref
                  ref={node => {
                    // hack : position list to the current selected item
                    if (item.id === record) {
                      const me = ReactDOM.findDOMNode(node);
                      if (me) {
                        setTimeout(() => {
                          me.parentNode.parentNode.scrollTop =
                            me.parentNode.offsetTop -
                            me.parentNode.offsetHeight -
                            me.offsetHeight;
                        });
                      }
                    }
                  }}
                >
                  <a style={{ color: item.id === record ? "white" : "auto" }}>
                    {item.title || "EMPTY ?"}
                  </a>
                </Link>
              </ListGroupItem>
            ))}
          </div>
        </ListGroup>
      </React.Fragment>
    )}
  />
);

export default ListRecordsView;
