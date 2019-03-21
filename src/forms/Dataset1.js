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
  Refresh as RefreshIcon
} from "@material-ui/icons";

import { suggestResults } from "../cdtn-api";

const getRowId = row =>
  row.source && row.slug ? `/${row.source}/${row.slug}` : row.url;

const DataSchema = Yup.object().shape({
  title: Yup.string()
    .min(10, "Titre trop court")
    .required("Titre requis"),
  refs: Yup.array()
    .of(Yup.object())
    .min(1, "Merci de définir au moins une référence")
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
    </TableRow>
  </TableFooter>
);

// handle multiple references
const References = ({
  setRowValue,
  setRowRelevance,
  values,
  onAddClick,
  onRefreshClick
}) => (
  <FieldArray
    name="refs"
    render={({ push, remove }) => (
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
                        query={getRowId(row) || ""}
                        fetchSuggestions={suggestResults}
                        onSelect={value => setRowValue(index, value)}
                      />
                    </TableCell>
                    <TableCell width={250} align="center">
                      <Relevance
                        value={row.relevance}
                        onChange={value => setRowRelevance(index, value)}
                      />
                    </TableCell>
                    <TableCell width={25}>
                      <IconButton
                        aria-label="Supprimer"
                        onClick={() => {
                          remove(index);
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
          onAddClick={() => onAddClick({ push })}
          onRefreshClick={onRefreshClick}
        />
      </Table>
    )}
  />
);

const Dataset1Form = ({ data, onSubmit }) => {
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
          onSubmit(values);
          actions.setStatus({ msg: "Données enregistrées" });
          // todo: handle failure
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
            <Card style={{ marginTop: 15 }}>
              <CardContent>
                <MultiLineInput
                  name="answer"
                  label="Message direct à afficher"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={(values && values.answer) || ""}
                />
              </CardContent>
            </Card>
            <Card style={{ marginTop: 15, overflow: "visible" }}>
              <CardContent>
                <Typography>Résultats à afficher</Typography>
                <References
                  values={values}
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
                    push({ title: "", url: null, relevance: 3 });
                    // todo: HACK
                    setTimeout(focusLastInput, 10);
                  }}
                  onRefreshClick={() => {
                    setFieldTouched("refs");
                    // todo: load results from CDTN search
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
          </form>
        )}
      />
    </div>
  );
};

export default Dataset1Form;
