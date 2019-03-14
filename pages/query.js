import React from "react";

import TextField from "@material-ui/core/TextField";

import Layout from "../src/Layout";
import SortableResults from "../src/SortableResults";

import Picker from "../src/Picker";

const data = require("../example.json");

const getData = query => data.find(x => x.query === query);

import { suggestResults } from "../src/api";

const storage = {};

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

class Query extends React.Component {
  static async getInitialProps({ query }) {
    const results = getData(query.query).children || [];
    return { query: query.query, results };
  }
  render() {
    const { query, results } = this.props;
    return (
      <Layout
        RightComponent={() => (
          <div>
            <TextField
              fullWidth
              label="Requêtes"
              defaultValue={query}
              margin="normal"
              variant="filled"
            />
            <RowsManager
              rows={results}
              render={({ updateRow, updateRows, rows }) => (
                <SortableResults
                  results={rows}
                  onReorder={updateRows}
                  renderRow={row =>
                    console.log("render.row", row) || (
                      <Picker
                        query={row.url || ""}
                        fetchSuggestions={suggestResults}
                        onSelect={value => updateRow(row, value)}
                      />
                    )
                  }
                />
              )}
            />
          </div>
        )}
      />
    );
  }
}

export default Query;
