import React from "react";
import App, { Container } from "next/app";
import Head from "next/head";
import KintoClient from "kinto-http";
import getConfig from "next/config";

import JssProvider from "react-jss/lib/JssProvider";
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import getPageContext from "../src/getPageContext";
import KintoContext from "../src/kinto/KintoContext";
import Layout from "../src/Layout";

const { publicRuntimeConfig } = getConfig();

const API_URL = publicRuntimeConfig.API_URL;

const kintoClient = url => {
  return new KintoClient(url);
};

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
    const client = kintoClient(API_URL);
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
          {/* MuiThemeProvider makes the theme available down the React
              tree thanks to React context. */}
          <MuiThemeProvider
            theme={this.pageContext.theme}
            sheetsManager={this.pageContext.sheetsManager}
          >
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* Pass pageContext to the _document though the renderPage enhancer
                to render collected styles on server-side. */}
            <KintoContext.Provider value={{ client }}>
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
