import React from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import Picker from "./CDTNPicker";
import Relevance from "./Relevance";

import {
  Card,
  CardContent,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableFooter,
  TableBody,
  TableCell,
  IconButton
} from "@material-ui/core";

import {
  Delete as DeleteIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  AddBox as AddBoxIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon
} from "@material-ui/icons";

import { searchResults } from "../cdtn-api";

const routeBySource = {
  faq: "question",
  code_bfc: "fiche-code-bfc",
  fiches_service_public: "fiche-service-public",
  fiches_ministere_travail: "fiche-ministere-travail",
  code_du_travail: "code-du-travail",
  conventions_collectives: "convention-collective",
  modeles_de_courriers: "modeles-de-courriers",
  themes: "themes",
  outils: "outils",
  idcc: "idcc",
  kali: "kali"
};

const getRowId = row =>
  row.source && row.slug
    ? `/${routeBySource[row.source] || row.source}/${row.slug}`
    : row.url;

const DataSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Titre trop court")
    .required("Titre requis")
});

const MultiLineInput = props => (
  <TextField
    multiline={true}
    fullWidth
    style={{ fonSize: "1.4em" }}
    onBlur={props.handleBlur}
    onChange={props.onChange}
    {...props}
  />
);

const MyTableFooter = ({ onAddClick, onRefreshClick }) => (
  <TableFooter>
    <TableRow>
      <TableCell>
        <Button
          onClick={onAddClick}
          size="small"
          color="primary"
          style={{
            whiteSpace: "nowrap",
            marginTop: 20,
            marginRight: 20
          }}
          variant="contained"
        >
          <AddBoxIcon size={16} style={{ marginRight: 10 }} />
          Ajouter une référence
        </Button>
      </TableCell>
      <TableCell />
      <TableCell>
        <Button
          onClick={onRefreshClick}
          size="small"
          style={{ whiteSpace: "nowrap", marginTop: 20 }}
          variant="contained"
        >
          <RefreshIcon size={16} style={{ marginRight: 10 }} />
          Charger depuis CDTN
        </Button>
      </TableCell>
      <TableCell />
    </TableRow>
  </TableFooter>
);

// handle multiple references
const References = ({
  setRowValue,
  setRowRelevance,
  values,
  onAddClick,
  onRemoveClick,
  onRefreshClick
}) => (
  <FieldArray
    name="refs"
    render={({ remove }) => (
      <Table padding="dense">
        <TableHead>
          <TableRow>
            {["Résultat", "-", "Pertinence"].map(col => (
              <TableCell key={col}>{col}</TableCell>
            ))}
            <TableCell key="remove">-</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values &&
            values.map(
              (row, index) =>
                row && (
                  <TableRow index={index} key={row + index}>
                    <TableCell>
                      <Picker
                        query={getRowId(row) || ""}
                        fetchSuggestions={searchResults}
                        onSelect={value => setRowValue(index, value)}
                      />
                    </TableCell>
                    <TableCell style={{ width: 25, padding: 0 }}>
                      <IconButton
                        aria-label="Preview"
                        onClick={() => {
                          const CDTN_URL =
                            "https://codedutravail-dev.num.social.gouv.fr";
                          const url =
                            row.url[0] === "/"
                              ? `${CDTN_URL}${row.url}`
                              : row.url;
                          window.open(url);
                        }}
                      >
                        <OpenInNewIcon size="medium" />
                      </IconButton>
                    </TableCell>
                    <TableCell
                      style={{ width: 250, padding: 0 }}
                      align="center"
                    >
                      <Relevance
                        value={row.relevance}
                        onChange={value => setRowRelevance(index, value)}
                      />
                    </TableCell>
                    <TableCell style={{ width: 25, padding: 0 }}>
                      <IconButton
                        aria-label="Supprimer"
                        onClick={() => {
                          onRemoveClick({ remove, index });
                        }}
                      >
                        <DeleteIcon size="medium" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
            )}
        </TableBody>
        <MyTableFooter
          onAddClick={onAddClick}
          onRefreshClick={onRefreshClick}
        />
      </Table>
    )}
  />
);

const Dataset1Form = ({ data, onSubmit, onDelete }) => {
  let root;

  const focusLastInput = () => {
    try {
      if (root) {
        const nodes = root.querySelectorAll("input[type='search']");
        if (nodes && nodes.length) {
          nodes[nodes.length - 1].focus();
        }
      }
    } catch (e) {
      console.log("cannot focus last input", e);
    }
  };

  return (
    <div ref={node => (root = node)}>
      <Formik
        initialValues={data}
        validationSchema={DataSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          onSubmit(values).then(() => {
            actions.setStatus({ msg: "Données enregistrées" });
            actions.setTouched(false);
          });
        }}
        render={({
          values,
          errors,
          status,
          touched,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          setFieldTouched,
          isSubmitting
        }) => (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardContent>
                <MultiLineInput
                  name="title"
                  label="Question usager"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={(values && values.title) || ""}
                />
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15 }}>
              <CardContent>
                <MultiLineInput
                  name="variants"
                  label="Questions similaires (une par ligne)"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={(values && values.variants) || ""}
                />
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15, overflow: "visible" }}>
              <CardContent>
                <Typography>Résultats à afficher</Typography>
                <References
                  values={values.refs}
                  setRowValue={(i, value) => {
                    const rowId = getRowId(value._source); //return source/slug or url
                    values.refs[i].url = rowId;
                    values.refs[i].title = value._source.title;
                    setFieldValue("refs", values.refs);
                    setFieldTouched("refs");
                  }}
                  setRowRelevance={(i, value) => {
                    values.refs[i].relevance = value;
                    setFieldValue("refs", values.refs);
                    setFieldTouched("refs");
                  }}
                  onAddClick={({ push }) => {
                    setFieldTouched("refs");
                    setFieldValue(
                      "refs",
                      values.refs.concat([{ title: "", url: "" }])
                    );
                    setTimeout(focusLastInput, 10);
                  }}
                  onRemoveClick={({ remove, index }) => {
                    values.refs.splice(index, 1);
                    setFieldValue("refs", values.refs);
                    setFieldTouched("refs");
                  }}
                  onRefreshClick={async ({ push }) => {
                    const res = await searchResults(values.title);
                    // concat with current selection, removing duplicates
                    const hits = res.hits.hits
                      .filter(
                        hit =>
                          values.refs
                            .map(ref => ref.url)
                            .indexOf(getRowId(hit._source)) === -1
                      )
                      .map(hit => ({
                        title: hit._source.title,
                        url: getRowId(hit._source)
                      }));
                    setFieldValue("refs", values.refs.concat(hits));
                  }}
                />
              </CardContent>
            </Card>
            {/* show formik errors */}
            {(Object.keys(errors).length && (
              <Card style={{ marginTop: 15 }}>
                <CardContent>
                  {Object.keys(errors)
                    .map(key => errors[key])
                    .map(error => (
                      <Typography key={error} color="error" variant="subtitle1">
                        <ErrorIcon
                          size={16}
                          style={{ verticalAlign: "middle", marginRight: 5 }}
                        />
                        {error}
                      </Typography>
                    ))}
                </CardContent>
              </Card>
            )) ||
              null}
            {/* show submit status */}
            {status && status.msg && (
              <Card style={{ marginTop: 15 }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    <CheckCircleIcon
                      size={16}
                      style={{ verticalAlign: "middle", marginRight: 5 }}
                    />
                    {status.msg}
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Grid container spacing={24}>
              <Grid item xs={6}>
                <Button
                  color="primary"
                  size="large"
                  style={{ whiteSpace: "nowrap", marginTop: 20 }}
                  variant="contained"
                  type="submit"
                  disabled={
                    // disable when errors, nothing changed or while submitting
                    !!Object.keys(errors).length ||
                    !Object.keys(touched).length ||
                    isSubmitting
                  }
                >
                  <SaveIcon size={16} style={{ marginRight: 10 }} />
                  Enregistrer
                </Button>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Button
                  size="large"
                  style={{
                    marginLeft: 20,
                    whiteSpace: "nowrap",
                    marginTop: 20
                  }}
                  variant="contained"
                  type="button"
                  onClick={onDelete}
                >
                  <DeleteIcon size={16} style={{ marginRight: 10 }} />
                  Supprimer
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      />
    </div>
  );
};

export default Dataset1Form;
