import React from "react";
import Link from "next/link";
import { ListGroup, ListGroupItem } from "reactstrap";
import { PlusSquare, Home } from "react-feather";
import Gradient from "gradient2";
import KintoContext from "./kinto/KintoContext";
import ThemeLink from "./ThemeLink";

// item
const getRequeteScore = item => {
  let score = 0;
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
  return Math.max(0, score);
};

const maxScore = 100;

const gradientColors = ["#cb3837", "#1CBF43"];
const progressGradients = new Gradient({
  colors: gradientColors,
  steps: maxScore,
  model: "rgb"
}).toArray();

const ProgressIndicator = ({ maxScore, score }) => {
  const scaledScore = parseInt(score && Math.min(maxScore - 1, score)) || 0;
  const color = progressGradients[scaledScore] || {
    rgb: () => gradientColors[0]
  };
  return (
    <div
      style={{
        display: "inline-block",
        margin: "0 10px 0 5px",
        verticalAlign: "middle",
        background: color && color.rgb(),
        width: 10,
        height: 10
      }}
    >
      &nbsp;
    </div>
  );
};

const ListRecordsView = ({
  records,
  bucket,
  collection,
  record,
  onAddClick
}) => {
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

        <div style={{ overflow: "scroll" }}>
          {records.map(item => (
            <ListGroupItem
              action
              active={item.id === record}
              title={item.title}
              key={item.id}
              style={{ padding: ".5rem 1.25rem" }}
            >
              <ProgressIndicator
                maxScore={maxScore}
                score={getRequeteScore(item)}
              />
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
