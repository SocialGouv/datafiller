import React from "react";
import { FieldArray } from "formik";
import { Button, Table } from "reactstrap";
import { Trash, ExternalLink, PlusSquare, RotateCw } from "react-feather";

import { searchResults } from "../../cdtn-api";

import CDTNPicker from "./CDTNPicker";
import Relevance from "./Relevance";
import getRowId from "./getRowId";

const MyTableFooter = ({ onAddClick, onRefreshClick }) => (
  <thead>
    <tr>
      <td>
        <Button
          onClick={onAddClick}
          size="small"
          color="primary"
          style={{
            whiteSpace: "nowrap",
            marginTop: 20,
            marginRight: 20
          }}
          variant="contained"
        >
          <PlusSquare size={16} style={{ marginRight: 10 }} />
          Ajouter une référence
        </Button>
      </td>
      <td />
      <td>
        <Button
          onClick={onRefreshClick}
          color="success"
          size="small"
          style={{ whiteSpace: "nowrap", marginTop: 20 }}
          variant="contained"
        >
          <RotateCw size={16} style={{ marginRight: 10 }} />
          Charger depuis CDTN
        </Button>
      </td>
      <td />
    </tr>
  </thead>
);

// handle multiple references
const References = ({
  setRowValue,
  setRowRelevance,
  values,
  onAddClick,
  onRemoveClick,
  onRefreshClick
}) => (
  <FieldArray
    name="refs"
    render={({ remove }) => (
      <Table padding="dense">
        <thead>
          <tr>
            <td>Résultat</td>
            <td>-</td>
            <td style={{ textAlign: "center" }}>Pertinence</td>
            <td>-</td>
          </tr>
        </thead>
        <tbody>
          {values &&
            values.map(
              (row, index) =>
                row && (
                  <tr index={index} key={row + index}>
                    <td>
                      <CDTNPicker
                        query={getRowId(row) || ""}
                        onSelect={value => setRowValue(index, value)}
                      />
                    </td>
                    <td
                      style={{ width: 25, padding: 0, verticalAlign: "middle" }}
                    >
                      <ExternalLink
                        size={16}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const CDTN_URL =
                            "https://codedutravail-dev.num.social.gouv.fr";
                          const url =
                            row.url[0] === "/"
                              ? `${CDTN_URL}${row.url}`
                              : row.url;
                          window.open(url);
                        }}
                      />
                    </td>
                    <td
                      style={{
                        width: 200,
                        padding: 0,
                        verticalAlign: "middle"
                      }}
                      align="center"
                    >
                      <Relevance
                        value={row.relevance}
                        onChange={value => setRowRelevance(index, value)}
                      />
                    </td>
                    <td
                      style={{ width: 16, padding: 0, verticalAlign: "middle" }}
                    >
                      <Trash
                        size={16}
                        onClick={() => {
                          onRemoveClick({ remove, index });
                        }}
                        style={{ cursor: "pointer", color: "#d63626" }}
                      />
                    </td>
                  </tr>
                )
            )}
        </tbody>
        <MyTableFooter
          onAddClick={onAddClick}
          onRefreshClick={onRefreshClick}
        />
      </Table>
    )}
  />
);

const CDTNReferences = ({ values, setFieldValue, setFieldTouched }) => (
  <References
    values={values.refs || []}
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
    onAddClick={() => {
      setFieldTouched("refs");
      setFieldValue(
        "refs",
        (values.refs || []).concat([{ title: "", url: "" }])
      );
    }}
    onRemoveClick={({ index }) => {
      values.refs.splice(index, 1);
      setFieldValue("refs", values.refs);
      setFieldTouched("refs");
    }}
    onRefreshClick={async () => {
      const res = await searchResults(values.title);
      // concat with current selection, removing duplicates
      const hits =
        (res.hits.hits &&
          res.hits.hits
            .filter(hit =>
              values.refs
                ? values.refs
                    .map(ref => ref.url)
                    .indexOf(getRowId(hit._source)) === -1
                : true
            )
            .map(hit => ({
              title: hit._source.title,
              url: getRowId(hit._source)
            }))) ||
        [];
      setFieldValue("refs", (values.refs || []).concat(hits));
      setFieldTouched("refs");
    }}
  />
);

export default CDTNReferences;
