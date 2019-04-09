import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";

import JssProvider from "react-jss/lib/JssProvider";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import getPageContext from "../src/getPageContext";
import KintoContext from "../src/kinto/KintoContext";
import Layout from "../src/Layout";
import kintoClient from "../src/kinto/client";

class MyApp extends App {
  constructor() {
    super();
    this.pageContext = getPageContext();
  }

  componentDidMount() {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles && jssStyles.parentNode) {
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
        {/* Wrap every page in Jss and Theme providers */}
        <JssProvider
          registry={this.pageContext.sheetsRegistry}
          generateClassName={this.pageContext.generateClassName}
        >
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            <CssBaseline />
            {/* provide a kinto client */}
            <KintoContext.Provider value={{ client: kintoClient }}>
              <Layout>
                <Component pageContext={this.pageContext} {...pageProps} />
              </Layout>
            </KintoContext.Provider>
          </MuiThemeProvider>
        </JssProvider>
      </Container>
    );
  }
}

export default MyApp;
