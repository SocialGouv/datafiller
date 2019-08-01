import React, { useState } from "react";
import Head from "next/head";

import { withRouter } from "next/router";
import { Button, Input } from "reactstrap";

import KintoContext from "../../../../../src/kinto/KintoContext";
import Layout from "../../../../../src/Layout";

const NewSearchInput = ({ onSubmit }) => {
  const [state, setState] = useState("");
  const onKeyUp = e => {
    if (e.nativeEvent.keyCode === 13) {
      onSubmit(e.target.value);
    }
    setState(e.target.value);
  };
  return (
    <React.Fragment>
      <Input
        style={{ margin: "20px 0" }}
        placeholder="ex: montant de la prime 13eme mois hotellerie"
        margin="normal"
        onKeyUp={onKeyUp}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSubmit(state)}
        disabled={!state}
      >
        Ajouter une nouvelle entrée
      </Button>
    </React.Fragment>
  );
};

// add new entry in
const addEntry = async ({ router, client, bucket, collection, value }) => {
  const result = await client
    .bucket(bucket)
    .collection(collection)
    .createRecord({ title: value });

  router.push(
    `/bucket/${bucket}/collection/${collection}/record/${result.data.id}`
  );
};

const CollectionIntro = withRouter(({ bucket, collection, router }) => (
  <React.Fragment>
    <p>Créer une nouvelle entrée</p>
    <KintoContext.Consumer>
      {({ client }) => (
        <NewSearchInput
          onSubmit={value =>
            console.log("NewSearchInput", value) ||
            addEntry({ router, client, bucket, collection, value })
          }
        />
      )}
    </KintoContext.Consumer>
  </React.Fragment>
));

const CollectionPage = props => (
  <Layout>
    <Head>
      <title>Dataset: {props.collection}</title>
    </Head>
    {(props.collection === "requetes" && <CollectionIntro {...props} />) ||
      null}
  </Layout>
);

CollectionPage.getInitialProps = async ({ query }) => {
  return {
    bucket: query.bucket,
    collection: query.collection
  };
};

export default CollectionPage;
