import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { Card, CardContent, Grid } from "@material-ui/core";

import {
  Delete as DeleteIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon
} from "@material-ui/icons";

import ThemePicker from "./ThemePicker";
import References from "./References";
import getRowId from "./getRowId";

import { searchResults } from "../cdtn-api";

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
                <ThemePicker
                  name="theme"
                  value={values.theme || ""}
                  onChange={value => {
                    setFieldValue("theme", value);
                    setFieldTouched("theme");
                  }}
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
