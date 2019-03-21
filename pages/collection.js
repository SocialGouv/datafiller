import React, { useState } from "react";
import Head from "next/head";

import EditRecord from "../src/EditRecord";

import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";

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
  let input;
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

const CollectionIntro = withStyles(rightStyles)(({ classes }) => (
  <React.Fragment>
    <Paper className={classes.info} elevation={1}>
      <Typography variant="h5" component="h3">
        Requètes utilisateur.
      </Typography>
      <Typography component="p">Définissez les réponses attendues</Typography>
    </Paper>
    <Paper className={classes.info} elevation={1}>
      <Typography variant="h5" component="h3">
        Créer une nouvelle recherche
      </Typography>
      <NewSearchInput onSubmit={val => alert(val)} />
    </Paper>
  </React.Fragment>
));

const CollectionPage = props => (
  <React.Fragment>
    <Head>
      <title>Dataset: {props.record ? props.record : props.collection}</title>
    </Head>
    {!props.record && <CollectionIntro />}
    {props.record && <EditRecord {...props} />}
  </React.Fragment>
);

CollectionPage.getInitialProps = async ({ query }) => {
  return {
    bucket: query.bucket,
    collection: query.collection,
    record: query.record
  };
};

export default CollectionPage;
