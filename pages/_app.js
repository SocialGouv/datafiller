import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";

import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import KintoContext from "../src/kinto/KintoContext";
import kintoClient from "../src/kinto/client";
import theme from "../src/theme";

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>Dataset editor</title>
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* provide a kinto client */}
          <KintoContext.Provider value={{ client: kintoClient }}>
            <Component {...pageProps} />
          </KintoContext.Provider>
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
