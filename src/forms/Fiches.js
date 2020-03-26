import React from "react";
import { Formik } from "formik";
import styled from "styled-components";
import { CheckCircle } from "react-feather";

import {
  Alert,
  Button,
  Container,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col
} from "reactstrap";

import { FormikErrors } from "./components/FormikErrors";

const MultiLineInput = props => (
  <Input
    type="textarea"
    style={{ fonSize: "0.8em", whiteSpace: "nowrap", lineHeight: "2em" }}
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

const FicheForm = ({ data, onSubmit }) => (
  <React.Fragment>
    <h1 style={{ margin: "1em 0" }}>Fiches {data.title}</h1>
    <Container>
      <Formik
        key={JSON.stringify(data)}
        enableReinitialize={true}
        initialValues={data}
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
          handleSubmit,
          isSubmitting
        }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Row style={{ marginBottom: 10 }}>
              <Col xs="10">
                <FormGroup>
                  <Label>Liste des fiches à intégrer</Label>
                  <MultiLineInput
                    name="urls"
                    rows={30}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    defaultValue={(values && values.urls) || ""}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormikErrors errors={errors} />

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
            </Row>
          </StyledForm>
        )}
      />
    </Container>
  </React.Fragment>
);

export default FicheForm;
