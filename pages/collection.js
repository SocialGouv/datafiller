import React, { useState } from "react";
import Head from "next/head";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

import { Router } from "../src/routes";
import KintoContext from "../src/kinto/KintoContext";

const rightStyles = theme => ({
  info: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: "1em"
  }
});

const NewSearchInput = ({ onSubmit }) => {
  const [state, setState] = useState("");
  let input; // used on InputProps
  const onKeyUp = e => {
    if (e.nativeEvent.keyCode === 13) {
      onSubmit(e.target.value);
    }
    setState(e.target.value);
  };
  return (
    <React.Fragment>
      <TextField
        style={{ margin: "20px 0" }}
        placeholder="ex: montant de la prime 13eme mois hotellerie"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true
        }}
        InputProps={{ ref: node => (input = node) }}
        onKeyUp={onKeyUp}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() => onSubmit(state)}
        disabled={!state}
      >
        <SaveIcon style={{ marginRight: 10 }} />
        Ajouter
      </Button>
    </React.Fragment>
  );
};

// add new entry in
const addEntry = async ({ client, bucket, collection, value }) => {
  const result = await client
    .bucket(bucket)
    .collection(collection)
    .createRecord({ title: value });

  Router.pushRoute("record", {
    bucket,
    collection,
    record: result.data.id
  });
};

const CollectionIntro = withStyles(rightStyles)(
  ({ classes, bucket, collection }) => (
    <React.Fragment>
      <Paper className={classes.info} elevation={1}>
        <Typography variant="h5" component="h3">
          Requètes utilisateur.
        </Typography>
        <Typography component="p">Définissez les réponses attendues</Typography>
      </Paper>
      <Paper className={classes.info} elevation={1}>
        <Typography variant="h5" component="h3">
          Créer une nouvelle entrée
        </Typography>
        <KintoContext.Consumer>
          {({ client }) => (
            <NewSearchInput
              onSubmit={value =>
                addEntry({ client, bucket, collection, value })
              }
            />
          )}
        </KintoContext.Consumer>
      </Paper>
    </React.Fragment>
  )
);

const CollectionPage = props => (
  <React.Fragment>
    <Head>
      <title>Dataset: {props.collection}</title>
    </Head>
    <CollectionIntro {...props} />
  </React.Fragment>
);

CollectionPage.getInitialProps = async ({ query }) => {
  return {
    bucket: query.bucket,
    collection: query.collection
  };
};

export default CollectionPage;
