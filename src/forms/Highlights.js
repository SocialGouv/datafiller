import React from "react";
import { Formik } from "formik";
import styled from "styled-components";
import * as Yup from "yup";
import useFetch from "react-fetch-hook";
import { CheckCircle } from "react-feather";

import { Alert, Button, Container, Form, FormGroup, Table } from "reactstrap";

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

const HighlightsForm = ({ data, onSubmit }) => {
  const { isLoading: isPopularLoading, data: populars } = useFetch(
    `/api/populars`
  );
  return (
    <React.Fragment>
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
            handleSubmit,
            setFieldTouched,
            isSubmitting
          }) => (
            <StyledForm onSubmit={handleSubmit}>
              <h1 style={{ margin: "1em 0" }}>Highlights - {values.title}</h1>
              <FormGroup row>
                <h2>Tendances à afficher (6 résultats)</h2>
                <CDTNReferences
                  sortable={true}
                  loadable={false}
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

              <FormGroup row style={{ justifyContent: "space-around" }}>
                <div>
                  <Button
                    color="primary"
                    style={{
                      marginTop: "15px",
                      marginBottom: "15px",
                      whiteSpace: "nowrap"
                    }}
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
                </div>
              </FormGroup>
              {isPopularLoading ? (
                <FormGroup row>...</FormGroup>
              ) : (
                <>
                  {Object.entries(populars).map(([key, populars]) => (
                    <FormGroup row key={key}>
                      <h2>{`Tendances ${
                        key === "month" ? "du mois" : "de la semaine"
                      }`}</h2>
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
                            {populars.map(({ growth, score, url, views }) => (
                              <tr key={url}>
                                <td>{score}</td>
                                <td>{url}</td>
                                <td>{growth}</td>
                                <td>{views}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </FormGroup>
                  ))}
                </>
              )}
            </StyledForm>
          )}
        />
      </Container>
    </React.Fragment>
  );
};

export default HighlightsForm;
