import React, { useState } from "react";
import { Formik, FieldArray } from "formik";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import TextField from "@material-ui/core/TextField";

import withKinto from "./kinto/withKinto";
import KintoFetch from "./kinto/KintoFetch";
import Picker from "./Picker";

import {
  Card,
  CardContent,
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
  AddBox as AddBoxIcon
} from "@material-ui/icons";

import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";

import { suggestResults } from "./api";

const range = (min, max) => Array.from({ length: max - min }).fill(false);

const colors = [
  "hsla(1, 100%, 70%, 1)",
  "hsla(25, 100%, 70%, 1)",
  "hsla(50, 100%, 70%, 1)",
  "hsla(75, 100%, 70%, 1)",
  "hsla(99, 100%, 70%, 1)"
];
const Relevance = ({ value, max = 5, onChange }) => (
  <div>
    {range(0, 5).map((_, i) => (
      <ButtonBase
        key={i}
        style={{
          background: colors[i],
          border: value - 1 === i ? "1px solid #333" : "1px solid transparent",
          width: 30,
          height: 30,
          margin: "0 2px"
        }}
        onClick={() => onChange(i + 1)}
      >
        {i + 1}
      </ButtonBase>
    ))}
  </div>
);

import * as Yup from "yup";

const DataSchema = Yup.object().shape({
  title: Yup.string()
    .min(10, "Titre trop court")
    .max(50, "Titre trop long")
    .required("Titre requis"),
  refs: Yup.array()
    .of(Yup.object())
    .min(1, "Merci de définir au moins une référence")
});

const Message = ({ open, variant, message }) => {
  const [state, setState] = useState(open);
  return (
    <Snackbar
      open={state}
      onClose={() => setState(false)}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <SnackbarContent variant={variant} message={message} />
    </Snackbar>
  );
};
const Dataset1Form = ({ data, onSubmit }) => {
  let root;
  return (
    <div ref={node => (root = node)}>
      <Formik
        initialValues={data}
        validationSchema={DataSchema}
        onSubmit={(values, actions) => {
          // actions.setErrors(
          //   { title: "not serious enough 1" },
          //   { title: "not serious enough 2" },
          //   { title: "not serious enough 3" }
          // );
          actions.setSubmitting(false);
          onSubmit(values);
          actions.setStatus({ msg: "Données enregistrées" });
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
                <TextField
                  multiline={true}
                  fullWidth
                  name="title"
                  style={{ fonSize: "1.4em" }}
                  label="Question usager"
                  onBlur={handleBlur}
                  onChange={e => {
                    setFieldValue("title", e.target.value);
                    setFieldTouched("title");
                  }}
                  defaultValue={(values && values.title) || ""}
                />
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15 }}>
              <CardContent>
                <TextField
                  style={{ marginTop: 15 }}
                  multiline={true}
                  rows={5}
                  fullWidth
                  name="variants"
                  label="Questions similaires (une par ligne)"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={(values && values.variants) || ""}
                />
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15 }}>
              <CardContent>
                <TextField
                  style={{ marginTop: 15 }}
                  multiline={true}
                  rows={5}
                  fullWidth
                  name="answer"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  label="Message direct à afficher"
                  defaultValue={(values && values.answer) || ""}
                />
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15 }}>
              <CardContent>
                <Typography style={{ marginTop: 15 }}>
                  Résultats à afficher
                </Typography>
                <FieldArray
                  name="refs"
                  render={({ push, remove }) => {
                    const setRowValue = (i, value) => {
                      values.refs[i].url = value._source.url;
                      values.refs[i].title = value._source.title;
                      setFieldValue("refs", values.refs);
                      setFieldTouched("refs");
                    };
                    const setRowRelevance = (i, value) => {
                      values.refs[i].relevance = value;
                      setFieldValue("refs", values.refs);
                      setFieldTouched("refs");
                    };
                    return (
                      <Table>
                        <TableHead>
                          <TableRow>
                            {["Résultat", "Pertinence"].map(col => (
                              <TableCell key={col}>{col}</TableCell>
                            ))}
                            <TableCell key="remove">-</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {values.refs &&
                            values.refs.map(
                              (row, index) =>
                                row && (
                                  <TableRow index={index} key={row + index}>
                                    <TableCell>
                                      <Picker
                                        query={row.title || ""}
                                        fetchSuggestions={suggestResults}
                                        onSelect={value =>
                                          setRowValue(index, value)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell width={250} align="center">
                                      <Relevance
                                        value={row.relevance}
                                        onChange={value =>
                                          setRowRelevance(index, value)
                                        }
                                      />
                                    </TableCell>
                                    <TableCell width={25}>
                                      <IconButton
                                        aria-label="Supprimer"
                                        onClick={() => {
                                          remove(index);
                                          //setFieldTouched("refs");
                                        }}
                                      >
                                        <DeleteIcon size="medium" />
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                )
                            )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell>
                              <Button
                                onClick={() => {
                                  setFieldTouched("refs");
                                  push({ title: "", url: null, relevance: 3 });
                                  // todo: HACK
                                  setTimeout(() => {
                                    try {
                                      const nodes = root.querySelectorAll(
                                        "input[type='search']"
                                      );
                                      nodes[nodes.length - 1].focus();
                                      nodes.focus();
                                    } catch (e) {
                                      console.log("cannot focus last input", e);
                                    }
                                  }, 200);
                                }}
                                size="small"
                                color="primary"
                                style={{ whiteSpace: "nowrap", marginTop: 20 }}
                                variant="contained"
                              >
                                <AddBoxIcon
                                  size={16}
                                  style={{ marginRight: 10 }}
                                />
                                Ajouter une référence
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    );
                  }}
                />
              </CardContent>
            </Card>
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
            <Button
              color="primary"
              size="large"
              style={{ whiteSpace: "nowrap", marginTop: 20 }}
              variant="contained"
              type="submit"
              disabled={
                !!Object.keys(errors).length ||
                !Object.keys(touched).length ||
                isSubmitting
              }
            >
              <SaveIcon size={16} style={{ marginRight: 10 }} />
              Enregistrer
            </Button>
          </form>
        )}
      />
    </div>
  );
};

const onSubmit = ({ client, bucket, collection, data }) =>
  client
    .bucket(bucket)
    .collection(collection)
    .updateRecord({ ...data });

const EditRecord = withKinto(({ client, bucket, collection, record }) => (
  <KintoFetch
    fetch={({ client }) =>
      client
        .bucket(bucket)
        .collection(collection)
        .getRecord(record)
    }
    render={({ status, result }) => (
      <React.Fragment>
        {status === "error" && <div>error</div>}
        {status === "success" && (
          <React.Fragment>
            <Dataset1Form
              data={result.data}
              onSubmit={data => onSubmit({ client, bucket, collection, data })}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  />
));

export default EditRecord;
