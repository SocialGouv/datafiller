import React from "react";

import Typography from "@material-ui/core/Typography";

import withKinto from "./kinto/withKinto";
import KintoFetch from "./kinto/KintoFetch";
//import { Router } from "./routes";

import { withRouter } from "next/router";

// todo: map kinto collections to components
const forms = {
  requetes: require("./forms/Requete").default,
  ccns: require("./forms/CCN").default
};

const onSubmit = ({ client, bucket, collection, data }) =>
  client
    .bucket(bucket, { headers: {} })
    .collection(collection, { headers: {} })
    .updateRecord({ ...data }, { headers: {} })
    .catch(e => {
      alert("Impossible d'enregistrer");
      throw e;
    });

const onDelete = ({ client, bucket, collection, id }) =>
  client
    .bucket(bucket, { headers: {} })
    .collection(collection, { headers: {} })
    .deleteRecord(id, { headers: {} })
    .catch(e => {
      alert("Impossible de supprimer");
      throw e;
    });

const EditRecord = withKinto(
  ({ client, bucket, collection, record, router }) => {
    // todo: use json-schema-form when no schema defined
    const Component = forms[collection];
    if (!Component) {
      throw new Error(
        `Cannot find editor component for collection ${collection}. Valid collections : ${Object.keys(
          forms
        ).join(", ")}`
      );
    }

    return (
      <KintoFetch
        fetch={({ client }) =>
          client
            .bucket(bucket, { headers: {} })
            .collection(collection, { headers: {} })
            .getRecord(record, { headers: {} })
        }
        render={({ status, result }) => (
          <React.Fragment>
            {status === "error" && (
              <Typography>Cet enregistrement n'a pas été trouvé :/</Typography>
            )}
            {status === "success" && (
              <React.Fragment>
                <Component
                  data={result.data}
                  onSubmit={data =>
                    onSubmit({ client, bucket, collection, data })
                  }
                  onDelete={() =>
                    onDelete({
                      client,
                      bucket,
                      collection,
                      id: result.data.id
                    }).then(() =>
                      router.push(`/bucket/${bucket}/collection/${collection}`)
                    )
                  }
                />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      />
    );
  }
);

export default withRouter(EditRecord);
