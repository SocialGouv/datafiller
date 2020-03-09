import React from "react";
import { Formik } from "formik";
import styled from "styled-components";
import * as Yup from "yup";
import useFetch from "react-fetch-hook";
import { CheckCircle } from "react-feather";

import {
  Alert,
  Button,
  Container,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Table
} from "reactstrap";

import CDTNReferences from "./components/CDTNReferences";

const DataSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Titre trop court")
    .required("Titre requis")
});

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

const HighlightsForm = ({ data, onSubmit, onDelete }) => {
  const { isLoading, data: populars } = useFetch(`/api/populars`);
  return (
    <React.Fragment>
      <h1 style={{ margin: "1em 0" }}>Highlights</h1>
      <Container>
        <Formik
          key={JSON.stringify(data)}
          enableReinitialize={true}
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
            setFieldValue,
            handleBlur,
            handleChange,
            handleSubmit,
            setFieldTouched,
            isSubmitting
          }) => (
            <StyledForm onSubmit={handleSubmit}>
              <FormGroup row>
                <Label>Page concernée</Label>
                <Input
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  defaultValue={(values && values.title) || ""}
                />
              </FormGroup>
              {isLoading ? (
                <FormGroup row>...</FormGroup>
              ) : (
                <>
                  <FormGroup row>
                    <h2>Tandances du mois précédent</h2>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "scroll"
                      }}
                    >
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>Score</th>
                            <th>Url</th>
                            <th>Croissance</th>
                            <th>Vues</th>
                          </tr>
                        </thead>
                        <tbody>
                          {populars.month.map(
                            ({ growth, score, url, views }) => (
                              <tr key={url}>
                                <td>{score}</td>
                                <td>{url}</td>
                                <td>{growth}</td>
                                <td>{views}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </FormGroup>
                  <FormGroup row>
                    <h2>Tandance de la semaine précédente</h2>
                    <div
                      style={{
                        maxHeight: "300px",
                        overflowY: "scroll"
                      }}
                    >
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>Score</th>
                            <th>Url</th>
                            <th>Croissance</th>
                            <th>Vues</th>
                          </tr>
                        </thead>
                        <tbody>
                          {populars.week.map(
                            ({ growth, score, url, views }) => (
                              <tr key={url}>
                                <td>{score}</td>
                                <td>{url}</td>
                                <td>{growth}</td>
                                <td>{views}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </FormGroup>
                </>
              )}
              <FormGroup row>
                <h2>Résultats à afficher (maximum 6 résultats)</h2>
                <CDTNReferences
                  sortable={true}
                  values={values}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                />
              </FormGroup>

              {/* show formik errors */}
              {(Object.keys(errors).length && (
                <Alert color="danger" style={{ margin: "15px 0" }}>
                  {Object.keys(errors)
                    .map(key => errors[key])
                    .map(error => (
                      <Alert key={error} color="error">
                        {error}
                      </Alert>
                    ))}
                </Alert>
              )) ||
                null}
              {/* show submit status */}
              {status && status.msg && (
                <Alert color="success" style={{ margin: "15px 0" }}>
                  <CheckCircle /> {status.msg}
                </Alert>
              )}

              <Row spacing={24}>
                <Col xs={6}>
                  <Button
                    color="primary"
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
                    style={{
                      marginLeft: 20,
                      whiteSpace: "nowrap",
                      marginTop: 20
                    }}
                    color="danger"
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
    </React.Fragment>
  );
};

export default HighlightsForm;
