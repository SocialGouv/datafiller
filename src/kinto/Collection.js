import React from "react";

import { Link, Router } from "../routes";
import KintoFetch from "./KintoFetch";
import KintoContext from "./KintoContext";

const CollectionView = ({ bucket, collection, records = [], record }) => (
  <ul>
    {records.map(recordItem => (
      <li key={recordItem.id}>
        {record && record === recordItem.id && "xxxx"}
        <Link
          key={recordItem.id}
          to="record"
          params={{ bucket, collection, record: recordItem.id }}
        >
          <a>{recordItem.title}</a>
        </Link>
      </li>
    ))}
  </ul>
);

const AddRecord = ({ onAdd }) => {
  let input;
  const onKeyUp = event => {
    if (event.nativeEvent.keyCode === 13) {
      onAdd(input.value);
    }
  };
  return (
    <div>
      <input ref={node => (input = node)} type="text" onKeyUp={onKeyUp} />
    </div>
  );
};

import ListRecords from "./ListRecords";

const Collection = props => (
  <ListRecords
    bucket={props.bucket}
    collection={props.collection}
    render={({ result }) => {
      console.log("result", result);
      return <div>RECORDS</div>;
    }}
  />
);

/*
 <KintoFetch
    fetch={({ client }) =>
      client
        .bucket(props.bucket)
        .collection(props.collection)
        .listRecords()
    }
    render={({ status, result }) => (
      <KintoContext.Consumer>
        {({ client }) => (
          <React.Fragment>
            <AddRecord
              onAdd={title =>
                client
                  .bucket(props.bucket)
                  .collection(props.collection)
                  .createRecord({ title })
                  .then(result => {
                    Router.pushRoute("record", {
                      bucket: props.bucket,
                      collection: props.collection,
                      record: result.data.id
                    });
                  })
              }
            />
            {status === "error" && <div>error</div>}
            {status === "success" && (
              <CollectionView {...props} records={result.data} />
            )}
          </React.Fragment>
        )}
      </KintoContext.Consumer>
    )}
  />
  */

export default Collection;
