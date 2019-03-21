import React from "react";
import { Formik } from "formik";
//import Form from "react-jsonschema-form";

import { Link } from "../src/routes";
import KintoFetch from "../src/kinto/KintoFetch";
import KintoContext from "../src/kinto/KintoContext";
import Collection from "../src/kinto/Collection";

import EditRecord from "../src/EditRecord";

// const schema = {
//   title: "Todo",
//   type: "object",
//   required: ["title"],
//   properties: {
//     title: { type: "string", title: "Title", default: "A new task" },
//     done: { type: "boolean", title: "Done?", default: false }
//   }
// };

// const log = message => () => console.log(message);

// const RecordForm = ({ onSubmit, ...formData }) => (
//   <Form
//     schema={schema}
//     formData={formData}
//     onChange={log("changed")}
//     onSubmit={onSubmit}
//     onError={log("errors")}
//   />
// );

const RecordView = ({ bucket, collection, record }) => (
  <div>
    <pre
      dangerouslySetInnerHTML={{ __html: JSON.stringify(record, null, 2) }}
    />
  </div>
);

const Record = ({ client, bucket, collection, record, onSubmit }) => (
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
            <RecordView
              bucket={bucket}
              collection={collection}
              record={result.data}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  />
);

const RecordPage = props => {
  const onSubmit = (client, formData) => {
    client
      .bucket(props.bucket)
      .collection(props.collection)
      .updateRecord({ ...formData, id: props.record })
      .then(console.log)
      .catch(console.log);
  };
  return (
    <div>
      <KintoContext.Consumer>
        {({ client }) => <EditRecord {...props} />}
      </KintoContext.Consumer>
    </div>
  );
};
RecordPage.getInitialProps = async ({ query }) => {
  return {
    bucket: query.bucket,
    collection: query.collection,
    record: query.record
  };
};

export default RecordPage;
