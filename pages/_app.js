import React from "react";
import App, { Container } from "next/app";
import getConfig from "next/config";
import Head from "next/head";
import * as Sentry from "@sentry/browser";
import { Row, Col } from "reactstrap";

import KintoContext from "../src/kinto/KintoContext";
import kintoClient from "../src/kinto/client";
import ListRecordsView from "../src/ListRecordsView";

import ErrorPage from "./_error";

const {
  publicRuntimeConfig: { SENTRY_PUBLIC_DSN }
} = getConfig();

//console.log("SENTRY_PUBLIC_DSN", SENTRY_PUBLIC_DSN);

if (typeof window !== "undefined" && SENTRY_PUBLIC_DSN) {
  Sentry.init({ dsn: SENTRY_PUBLIC_DSN, debug: true });
}

const leftComponents = {
  themes: ListRecordsView,
  default: ListRecordsView
};

export const ListRecords = ({ router }) => {
  const bucket = router.query.bucket;
  const record = router.query.record;
  const collection = router.query.collection;
  const LeftComponent = leftComponents[collection] || leftComponents.default;
  if (bucket && collection) {
    return (
      <LeftComponent
        bucket={bucket}
        collection={collection}
        record={record}
        onAddClick={async ({ client }) => {
          const defaultRecordData = {
            requetes: { title: "", intro: "", theme: null, refs: [{}] },
            ccns: { title: "", groups: {}, intro: "" },
            themes: { title: "", theme: null, refs: [{}] }
          };
          const result = await client
            .bucket(bucket, { headers: {} })
            .collection(collection, { headers: {} })
            .createRecord(defaultRecordData[collection], {
              headers: {}
            });

          router.push(
            `/bucket/${bucket}/collection/${collection}/record/${
              result.data.id
            }`
          );

          // hack
          setTimeout(() => {
            const target = document.querySelector("textarea[name='title']");
            if (target) {
              target.focus();
            }
          }, 200);
        }}
        intro="Restant à compléter"
      />
    );
  }
  return null;
};

const Layout = ({ left, children }) => (
  <Row>
    {left && <Col xs={3}>{left}</Col>}
    <Col xs={left ? 9 : 12}>
      <Container>{children}</Container>
    </Col>
  </Row>
);

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      try {
        pageProps = await Component.getInitialProps(ctx);
      } catch (err) {
        pageProps = { statusCode: 500, message: err.message };
      }
    }
    // pageUrl and ogImage are only defined on serverside request
    if (ctx.req) {
      pageProps.pageUrl = `${ctx.req.protocol}://${ctx.req.headers.host}${
        ctx.req.path
      }`;
      pageProps.ogImage = `${ctx.req.protocol}://${
        ctx.req.headers.host
      }/static/images/social-preview.png`;
    }
    console.log("pageProps", pageProps);
    return { pageProps };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps, router } = this.props;
    const layoutLeft = this.props.router.query.collection && (
      <ListRecords router={router} />
    );

    if (pageProps.statusCode) {
      return <ErrorPage statusCode={pageProps.statusCode} />;
    }
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
          <Layout left={layoutLeft}>
            <Component {...pageProps} />
          </Layout>
        </KintoContext.Provider>
      </Container>
    );
  }
}

export default MyApp;
