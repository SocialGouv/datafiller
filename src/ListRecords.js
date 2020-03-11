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
            ccns: { title: "", groups: {}, intro: "" },
            glossaire: { title: "", abbrs: "", definition: "", refs: [{}] },
            reponses: { title: "", variants: "", markdown: "", refs: [{}] },
            requetes: { title: "", intro: "", theme: null, refs: [{}] },
            themes: { title: "", parent: null, position: null, refs: [{}] }
          };
          const result = await client
            .bucket(bucket, { headers: {} })
            .collection(collection, { headers: {} })
            .createRecord(
              defaultRecordData[collection] || { title: "nouveau" },
              {
                headers: {}
              }
            );
          router.push(
            `/bucket/[bucket]/collection/[collection]/record/[record]`,
            `/bucket/${bucket}/collection/${collection}/record/${result.data.id}`
          );
          setTimeout(() => {
            const target = document.querySelector("input[name='title']");
            if (target) target.focus();
          }, 200);
        }}
        intro="Restant à compléter"
      />
    );
  }
  return null;
};
