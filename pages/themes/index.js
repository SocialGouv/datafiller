import React from "react";
import Head from "next/head";
import Link from "next/link";
import { Table, Progress } from "reactstrap";

import Layout from "../../src/Layout";
import getClient from "../../src/kinto/client";
import dump from "../../src/dump.data.json";
import { sources, getRouteBySource } from "../../src/sources";

const ContentPage = props => {
  const { recap } = props;
  return (
    <div>
      <Head>
        <title>Theming</title>
      </Head>
      <Layout>
        <h4 style={{ margin: "40px 0" }}>
          <Link href="/">
            <a>Accueil</a>
          </Link>{" "}
          > Contenus à thémer
        </h4>
        <Table striped>
          {recap
            .filter(item => item.items.length)
            .map(item => (
              <tr key={item.source}>
                <td>
                  <Link
                    href={`/themes/[source]`}
                    as={`/themes/${item.source}`}
                    passHref
                  >
                    <a>{getRouteBySource(item.source)}</a>
                  </Link>
                </td>
                <td>
                  <div>
                    <Progress
                      value={
                        ((item.total - item.items.length) / item.total) * 100
                      }
                    >
                      {parseInt(
                        ((item.total - item.items.length) / item.total) * 100
                      )}
                      %
                    </Progress>
                  </div>
                </td>
              </tr>
            ))}
        </Table>
      </Layout>
    </div>
  );
};

ContentPage.getInitialProps = async ({ query }) => {
  const client = getClient();
  const themes = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .listRecords({ limit: 1000 });

  const bySource = source => {
    const hasTheme = content => {
      const contentSlug = `${getRouteBySource(source)}/${content.slug}`;
      return themes.data.find(
        theme => theme.refs && theme.refs.find(ref => ref.url === contentSlug)
      );
    };
    const hasNoTheme = content => !hasTheme(content);
    const allContent = dump.filter(content => content.source === source);
    const noThemeContents = allContent.filter(hasNoTheme);

    return {
      total: allContent.length,
      items: noThemeContents
    };
  };

  const recap = sources
    .filter(source => source !== "themes")
    .map(source => ({
      source,
      ...bySource(source)
    }));

  return {
    recap
  };
};

export default ContentPage;
