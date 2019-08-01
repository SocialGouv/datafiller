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
        <ListGroup style={{ overflow: "scroll", height: "100vh" }}>
          <Link href="/" passHref>
            <ListGroupItem tag="a" action>
              Accueil
            </ListGroupItem>
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
              href={`/bucket/${bucket}/collection/${collection}/record/${
                item.id
              }`}
              passHref
            >
              <ListGroupItem
                tag="a"
                action
                active={item.id === record}
                title={item.title}
                key={item.id}
                style={{
                  backgroundColor: item.id !== record && getBgColor(item)
                }}
              >
                <span
                  ref={node => {
                    // hack : position list to the current selected item
                    if (item.id === record) {
                      const me = ReactDOM.findDOMNode(node);
                      if (me) {
                        console.log(me.offsetTop, me.offsetHeight);
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
                  {item.title}
                </span>
              </ListGroupItem>
            </Link>
          ))}
        </ListGroup>
      </React.Fragment>
    )}
  />
);

export default ListRecordsView;
