import React from "react";
import KintoContext from "./KintoContext";
import AsyncFetch from "../lib/AsyncFetch";

const KintoFetch = ({ fetch, render }) => (
  <KintoContext.Consumer>
    {({ client }) => (
      <AsyncFetch
        fetch={() => fetch({ client })}
        autoFetch={true}
        render={render}
      />
    )}
  </KintoContext.Consumer>
);

export default KintoFetch;
