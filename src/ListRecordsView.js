import React from "react";
import ReactDOM from "react-dom";

import ListRecords from "../src/kinto/ListRecords";
import KintoContext from "../src/kinto/KintoContext";

import { Button, ListGroup, ListGroupItem } from "reactstrap";

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
          <Link href="/" as="/" passHref>
            <ListGroupItem tag="a">Accueil</ListGroupItem>
          </Link>
          {collection === "requetes" && (
            <ListGroupItem>
              <KintoContext.Consumer>
                {({ client }) => (
                  <Button onClick={() => onAddClick({ client })}>
                    Ajouter une nouvelle entrée
                  </Button>
                )}
              </KintoContext.Consumer>
            </ListGroupItem>
          )}
          {result.data.map(item => (
            <Link
              key={item.id}
              // href="/bucket/[bucket]/collection/[collection]/record/[record]"
              href={`/bucket/${bucket}/collection/${collection}/record/${item.id}`}
            >
              <ListGroupItem
                action
                tag="a"
                href="#"
                selected={item.id === record}
                title={item.title}
                ref={node => {
                  // hack : position list to the current selected item
                  if (item.id === record) {
                    const me = ReactDOM.findDOMNode(node);
                    if (me) {
                      me.parentNode.scrollTop = me.offsetTop - me.offsetHeight;
                    }
                  }
                }}
                key={item.id}
                button
                onClick={() => {} /*onRecordClick(item)*/}
                style={{
                  backgroundColor: item.id !== record && getBgColor(item)
                }}
              >
                {item.title}
              </ListGroupItem>
            </Link>
          ))}
        </ListGroup>
      </React.Fragment>
    )}
  />
);

export default ListRecordsView;
