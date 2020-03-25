import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { Table } from "reactstrap";
import { Edit } from "react-feather";

import Layout from "../../src/Layout";
import getClient from "../../src/kinto/client";
import { getRouteBySource } from "../../src/sources";
import ThemePicker from "../../src/forms/components/ThemePicker";
import { getThemes, hasTheme } from "../../src/kinto/getThemes";

import { getSitemapUrls, slugify, matchSource } from "../../src/cdtn-sitemap";

// remove duplicates (ex: splitted content)
const uniquify = arr => Array.from(new Set(arr));

const removeProtocol = url => url.replace(/^https?:\/\/[^/]+/, "");

// add to theme record
const addToTheme = async (url, theme, allUrls) => {
  const client = getClient();
  const themeRecord = await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .getRecord(theme);

  const newRefs = [];

  // select all fiches MT with same slug
  if (url.match(/fiche-ministere-travail/)) {
    const siblings = allUrls
      .filter(url2 => slugify(url2) === slugify(url))
      .map(url => ({
        title: "",
        // keep slug only
        url: removeProtocol(url)
      }));
    newRefs.push(...siblings);
  } else {
    newRefs.push({
      title: "",
      url: removeProtocol(url)
    });
  }

  const allRefs = [...(themeRecord.data.refs || []), ...newRefs];

  await client
    .bucket("datasets", { headers: {} })
    .collection("themes", { headers: {} })
    .updateRecord(
      {
        id: theme,
        refs: allRefs
      },
      {
        patch: true
      }
    );
};

const ThemeSelector = ({ addToTheme }) => {
  const [theme, setTheme] = useState("");
  return (
    <ThemePicker
      name="theme"
      style={{ cursor: "pointer" }}
      lazy={true}
      title={theme.title || <Edit />}
      value={theme && theme.id}
      onChange={theme => {
        addToTheme(theme.id);
        setTheme(theme);
      }}
    />
  );
};

const ContentPage = props => {
  const { allUrls, unThemedUrls, source } = props;
  const label = getRouteBySource(source);
  if (!unThemedUrls || unThemedUrls.length === 0) {
    return (
      <Layout>
        <h4 style={{ margin: "40px 0" }}>
          <Link href="/">
            <a>Accueil</a>
          </Link>{" "}
        </h4>
        Aucun contenu à thémer
      </Layout>
    );
  }

  return (
    <div>
      <Head>
        <title>Theming {label}</title>
      </Head>
      <Layout>
        <h4 style={{ margin: "40px 0" }}>
          <Link href="/">
            <a>Accueil</a>
          </Link>{" "}
          &gt; {unThemedUrls.length} {label} sans thème
        </h4>
        <Table padding="dense" striped>
          <thead>
            <tr>
              <td width="400">Thème</td>
              <td>Titre</td>
            </tr>
          </thead>
          <tbody>
            {unThemedUrls.map(url => (
              <tr key={url}>
                <td width="400">
                  <ThemeSelector
                    addToTheme={theme => addToTheme(url, theme, allUrls)}
                  />
                </td>
                <td>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {slugify(url)}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Layout>
    </div>
  );
};

export const getServerSideProps = async ({ query }) => {
  const { source } = query;

  const themes = await getThemes();

  // fetch master sitemap content
  const allUrls = await getSitemapUrls();

  const hasNoTheme = url => !hasTheme(url, themes);

  const unThemedUrls = uniquify(
    allUrls
      .filter(
        url =>
          // find same source contents
          !source || matchSource(source)(url)
      )
      .filter(hasNoTheme)
      .map(url => url.split("#")[0])
  );

  return {
    props: {
      allUrls,
      unThemedUrls,
      source
    }
  };
};

export default ContentPage;
