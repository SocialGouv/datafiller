import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Table } from "reactstrap";

import Layout from "../../src/Layout";
import getClient from "../../src/kinto/client";
import dump from "../../src/dump.data.json";
import { getRouteBySource } from "../../src/sources";

const ThemeItems = ({ records }) => (
  <Table padding="dense" striped>
    <thead>
      <tr>
        <td>Titre</td>
        <td>Thème</td>
      </tr>
    </thead>
    <tbody>
      {records.map(record => (
        <tr key={record.id}>
          <td>
            <a href={record.url} target="_blank">
              {record.title}
            </a>
          </td>
          <td>No thème</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

const ContentPage = props => {
  const { records, source, ...otherProps } = props;
  const label = getRouteBySource(source);
  return (
    <div>
      <Head>
        <title>Theming {label}</title>
      </Head>
      <Layout>
        <h4 style={{ margin: "40px 0" }}>
          <Link href="/themes">
            <a>Thèmes</a>
          </Link>{" "}
          > {records.length} {label} sans thème
        </h4>
        <ThemeItems records={records} />
      </Layout>
    </div>
  );
};

ContentPage.getInitialProps = async ({ query }) => {
  const { source } = query;
  const client = getClient();
  const themes = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .listRecords({ limit: 1000 });
  //console.log("themes", themes);
  const hasTheme = content => {
    ///fiche-service-public/maladie-professionnelle-indemnisation-en-cas-dincapacite-permanente"
    const contentSlug = `${getRouteBySource(source)}/${content.slug}`;
    return themes.data.find(
      theme => theme.refs && theme.refs.find(ref => ref.url === contentSlug)
    );
  };
  const hasNoTheme = content => !hasTheme(content);
  const noThemeContents = dump
    .filter(content => content.source === source)
    .filter(hasNoTheme);
  /*.filter(
      content => !content.breadcrumbs || content.breadcrumbs.length === 0
    );*/

  return {
    records: noThemeContents,
    source
  };
};

export default ContentPage;
