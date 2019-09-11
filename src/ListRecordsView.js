import React, { useState } from "react";
import Link from "next/link";
import { ListGroup, ListGroupItem, Input } from "reactstrap";
import { PlusSquare, Home } from "react-feather";
import KintoContext from "./kinto/KintoContext";
import ThemeLink from "./ThemeLink";
import ProgressIndicator from "./forms/components/ProgressIndicator";

// item
const getRequeteScore = (collection, item) => {
  let score = 0;
  if (collection === "requetes") {
    score +=
      (item.refs &&
        Math.min(10, item.refs.filter(r => r.url && r.relevance).length)) ||
      0;
    score +=
      (item.variants && Math.min(20, item.variants.split("\n").length)) || 0;
    if (item.theme) {
      score += 50;
    } else {
      score -= 80;
    }
  }
  if (collection === "glossaire") {
    score += item.definition ? Math.min(50, item.definition.length * 5) : 0;
    score +=
      (item.refs && Math.min(50, item.refs.filter(r => r.url).length * 10)) ||
      0;
    score +=
      (item.variants && Math.min(30, item.variants.split("\n").length * 10)) ||
      0;
    score +=
      (item.abbrs && Math.min(20, item.abbrs.split("\n").length * 10)) || 0;
  }
  if (collection === "ccns") {
    score +=
      (item.groups &&
        item.groups.filter &&
        item.groups.filter(group => group.selection.length).length * 8) ||
      0;
  }
  return Math.min(100, Math.max(0, score));
};

const normalize = str => str.toLowerCase().trim();

const matchQuery = query => record =>
  !query || normalize(record.title).includes(normalize(query));

const ListRecordsView = ({
  records,
  bucket,
  collection,
  record,
  onAddClick
}) => {
  const [query, setQuery] = useState("");
  return (
    <React.Fragment>
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

        <ListGroupItem style={{ flex: "0 0 auto" }}>
          <Input
            onChange={e => setQuery(e.target.value)}
            value={query}
            placeholder="Filtrer"
          />
        </ListGroupItem>

        <div style={{ overflow: "scroll" }}>
          {records.filter(matchQuery(query)).map(item => (
            <ListGroupItem
              action
              active={item.id === record}
              title={item.title}
              key={item.id}
              style={{ padding: ".5rem 1.25rem" }}
            >
              <ProgressIndicator score={getRequeteScore(collection, item)} />
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
  );
};

export default ListRecordsView;
