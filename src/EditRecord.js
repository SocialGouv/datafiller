import React from "react";
import { Formik, FieldArray } from "formik";

import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import SortableResults from "./SortableResults";
import KintoFetch from "./kinto/KintoFetch";
import Picker from "./Picker";

import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody
} from "@material-ui/core";

import { suggestResults } from "./api";

class RowsManager extends React.Component {
  state = {
    rows: this.props.rows
  };
  updateRow = (row, value) => {
    console.log("updateRow", row, value);
    this.setState(curState => {
      let updated = false;
      return {
        rows: curState.rows.map(curRow => {
          if (!updated) {
            if (!row || curRow.url === row.url) {
              updated = true;
              console.log("SET TO", value._source.slug);
              return {
                url: value._source.slug
              };
            }
          }
          return curRow;
        })
        // .filter(r => !!r.url)
      };
    });
  };
  updateRows = rows => {
    console.log("updateRows.rows", rows);
    this.setState({ rows });
  };
  render() {
    console.log("Render", this.state.rows);
    return this.props.render({
      updateRow: this.updateRow,
      updateRows: this.updateRows,
      rows: this.state.rows
    });
  }
}

const REFS = ["abc", "def", "123"];

const updateRows = props => console.log("updateRows", props);

const Dataset1Form = ({ data, onSubmit }) => (
  <div>
    <Formik
      initialValues={data}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        actions.setStatus({ msg: "all good baby" });
        onSubmit(values);
      }}
      render={({
        values,
        errors,
        status,
        touched,
        handleBlur,
        handleChange,
        setFieldValue,
        handleSubmit,
        isSubmitting
      }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            multiline={false}
            fullWidth
            label="Question usager"
            defaultValue={data.title}
            margin="normal"
            variant="filled"
          />
          <TextField
            multiline={true}
            rows={5}
            fullWidth
            label="Questions similaires"
            defaultValue={"blalala"}
            margin="normal"
            variant="filled"
          />
          <FieldArray
            name="refs"
            render={({ move, swap, push, insert, unshift, pop }) => (
              <SortableResults
                results={REFS}
                onReorder={updateRows}
                columns={["Résultats", "Pertinence"]}
                renderRow={row => (
                  <React.Fragment>
                    <TableCell>
                      <Picker
                        query={row.url || ""}
                        fetchSuggestions={suggestResults}
                        onSelect={value => setFieldValue("row", value)}
                      />
                    </TableCell>
                    <TableCell>+++++++</TableCell>
                  </React.Fragment>
                )}
              />
            )}
          />

          {status && status.msg && <div>{status.msg}</div>}
          <button type="submit" disabled={isSubmitting}>
            Enregistrer
          </button>
        </form>
      )}
    />
  </div>
);

const onSubmit = values => {
  console.log("onSubmit 2", values);
};

const EditRecord = ({ bucket, collection, record }) => (
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
            <Dataset1Form data={result.data} onSubmit={onSubmit} />
          </React.Fragment>
        )}
      </React.Fragment>
    )}
  />
);

export default EditRecord;
