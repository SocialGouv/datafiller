import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";

import KintoContext from "../src/kinto/KintoContext";
import kintoClient from "../src/kinto/client";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Dataset editor</title>
          <link
            rel="stylesheet"
            href="https://socialgouv.github.io/bootstrap/master/@socialgouv/bootstrap.core/dist/socialgouv-bootstrap.min.css"
            integrity="grB93+Lj8+H7BK2kCBM0dGAJD+8tE7pYqy6qkcykr8DfCJt7PhJOF998Bwj7BAWc"
            crossOrigin="anonymous"
          />
        </Head>
        {/* provide a kinto client */}
        <KintoContext.Provider value={{ client: kintoClient }}>
          <Component {...pageProps} />
        </KintoContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
