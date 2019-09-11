import React from "react";

import ListRecordsView from "../src/ListRecordsView";
import TreeRecordsView from "../src/TreeRecordsView";

const leftComponents = {
  themes: TreeRecordsView,
  default: ListRecordsView
};

export const ListRecords = ({ records, router }) => {
  const { bucket, record, collection } = router.query;
  const LeftComponent = leftComponents[collection] || leftComponents.default;
  if (bucket && collection) {
    return (
      <LeftComponent
        records={records}
        bucket={bucket}
        collection={collection}
        record={record}
        onAddClick={async ({ client }) => {
          const defaultRecordData = {
            requetes: { title: "", intro: "", theme: null, refs: [{}] },
            glossaire: { title: "", abbrs: [], definition: "", refs: [{}] },
            ccns: { title: "", groups: {}, intro: "" },
            themes: { title: "", parent: null, position: null, refs: [{}] }
          };
          const result = await client
            .bucket(bucket, { headers: {} })
            .collection(collection, { headers: {} })
            .createRecord(defaultRecordData[collection], {
              headers: {}
            });

          router.push(
            `/bucket/${bucket}/collection/${collection}/record/${result.data.id}`
          );
        }}
        intro="Restant à compléter"
      />
    );
  }
  return null;
};
