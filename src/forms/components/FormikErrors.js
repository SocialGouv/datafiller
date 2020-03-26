import React from "react";

import { Alert } from "reactstrap";

export const FormikErrors = ({ errors }) => (
  <React.Fragment>
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
  </React.Fragment>
);
