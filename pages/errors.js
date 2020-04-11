import React from "react";
import getConfig from "next/config";
import Link from "next/link";

import Layout from "../src/Layout";
import { getSitemapUrls } from "../src/cdtn-sitemap";
import ListRecords from "../src/kinto/ListRecords";

const { publicRuntimeConfig } = getConfig();

const bucket = publicRuntimeConfig.KINTO_BUCKET;

const isValidabledUrl = (url) =>
  url.match(/^\/fiche-ministere-travail\//) ||
  url.match(/^\/fiche-service-public\//) ||
  url.match(/^\/contribution\//) ||
  url.match(/^\/modeles-de-courriers\//);

const ListErrors = ({ sitemapUrls, collection }) => {
  const isValidUrl = (url) =>
    url &&
    isValidabledUrl(url) &&
    !sitemapUrls.includes("https://code.travail.gouv.fr" + url);

  const hasInvalidRefs = (record) =>
    record.refs.filter((ref) => isValidUrl(ref.url)).length;

  return (
    <ListRecords
      bucket={bucket}
      collection={collection}
      render={({ result }) => {
        const invalidRecords = result.data.filter(hasInvalidRefs);
        return (
          <div>
            <h4>
              {collection} ({invalidRecords.length})
            </h4>
            {invalidRecords.map((record) => (
              <div key={record.id}>
                <li>
                  <Link
                    href={`/bucket/[bucket]/collection/[collection]/record/[record]`}
                    as={`/bucket/${bucket}/collection/${collection}/record/${record.id}`}
                    passHref
                  >
                    <a>{record.title}</a>
                  </Link>
                </li>
                <ul style={{ marginBottom: 5 }}>
                  {record.refs
                    .filter((ref) => isValidUrl(ref.url))
                    .map((ref) => (
                      <li key={ref.url}>{ref.url}</li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};

const Errors = ({ sitemapUrls }) => {
  return (
    <Layout>
      <h4 style={{ margin: "40px 0" }}>
        <Link href="/">
          <a>Accueil</a>
        </Link>{" "}
        &gt; Références HS
      </h4>
      <p>
        Les entrées ci-dessous référencent des liens que n&apos;existent plus
      </p>

      <ListErrors sitemapUrls={sitemapUrls} collection="requetes" />
      <ListErrors sitemapUrls={sitemapUrls} collection="themes" />
    </Layout>
  );
};

export const getServerSideProps = async () => {
  const sitemapUrls = await getSitemapUrls();
  return { props: { sitemapUrls } };
};

export default Errors;
