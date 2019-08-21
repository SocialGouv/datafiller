import React from "react";
import ReactDOM from "react-dom";

import ListRecords from "../src/kinto/ListRecords";

import { ListGroup, ListGroupItem } from "reactstrap";

import { PlusSquare, Home } from "react-feather";

import KintoContext from "./kinto/KintoContext";

import Link from "next/link";

const ThemeLink = ({ bucket, collection, record, item, focus = false }) => (
  <Link
    href={`/bucket/[bucket]/collection/[collection]/record/[record]`}
    as={`/bucket/${bucket}/collection/${collection}/record/${item.id}`}
    passHref
    ref={node => {
      // hack
      if (focus) {
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
      {item.title || "-----"}
    </a>
  </Link>
);

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
    .map(item => (
      <React.Fragment key={item.id}>
        <ListGroupItem
          action
          active={item.id === record}
          title={item.title}
          style={{
            //backgroundColor: item.id !== record && getBgColor(item),
            paddingLeft: 15 * (depth + 1)
            // border: 0
          }}
        >
          <ThemeLink
            bucket={bucket}
            collection={collection}
            item={item}
            record={record}
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
