import React from "react";

import { Link } from "../routes";

import ListRecords from "./ListRecords";

const Collection = props => (
  <ListRecords
    bucket={props.bucket}
    collection={props.collection}
    render={({ result }) => {
      console.log("result", result);
      return <div>RECORDS</div>;
    }}
  />
);

export default Collection;
