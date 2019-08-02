import React from "react";
import { Formik } from "formik";
import styled from "styled-components";
import * as Yup from "yup";

import {
  Alert,
  Button,
  Container,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";

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
  <Input
    type="textarea"
    style={{ fonSize: "1.4em" }}
    onBlur={props.handleBlur}
    onChange={props.onChange}
    {...props}
  />
);

const StyledForm = styled(Form)`
  .row {
    padding: 10px;
    border: 1px solid silver;
    border-radius: 2px;
    background: #efefef;
  }
  label {
    font-weight: bold;
  }
`;

const RequeteForm = ({ data, onSubmit, onDelete }) => {
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
    <Container ref={node => (root = node)}>
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
          <StyledForm onSubmit={handleSubmit}>
            <FormGroup row>
              <Label>Question usager</Label>
              <Input
                name="title"
                label="Question usager"
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={(values && values.title) || ""}
              />
            </FormGroup>

            <FormGroup row>
              <Label>Questions similaires (une par ligne)</Label>
              <MultiLineInput
                name="variants"
                label="Questions similaires (une par ligne)"
                rows={10}
                onBlur={handleBlur}
                onChange={handleChange}
                defaultValue={(values && values.variants) || ""}
              />
            </FormGroup>

            <FormGroup row>
              <Label>Thème</Label>
              <ThemePicker
                name="theme"
                value={values.theme || ""}
                onChange={value => {
                  setFieldValue("theme", value);
                  setFieldTouched("theme");
                }}
              />
            </FormGroup>

            <FormGroup row>
              <Label>Résultats à afficher</Label>
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
            </FormGroup>

            {/* show formik errors */}
            {(Object.keys(errors).length && (
              <Card style={{ marginTop: 15 }}>
                <CardBody>
                  {Object.keys(errors)
                    .map(key => errors[key])
                    .map(error => (
                      <Alert key={error} color="error">
                        {error}
                      </Alert>
                    ))}
                </CardBody>
              </Card>
            )) ||
              null}
            {/* show submit status */}
            {status && status.msg && (
              <Card style={{ marginTop: 15 }}>
                <CardBody>{status.msg}</CardBody>
              </Card>
            )}

            <Row container spacing={24}>
              <Col xs={6}>
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
                  Enregistrer
                </Button>
              </Col>
              <Col xs={6} style={{ textAlign: "right" }}>
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
                  Supprimer
                </Button>
              </Col>
            </Row>
          </StyledForm>
        )}
      />
    </Container>
  );
};

export default RequeteForm;
