import React from "react";
import { FieldArray } from "formik";

import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableFooter,
  IconButton
} from "@material-ui/core";

import {
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  AddBox as AddBoxIcon,
  Refresh as RefreshIcon
} from "@material-ui/icons";

import CDTNPicker from "./CDTNPicker";
import Relevance from "./Relevance";
import getRowId from "./getRowId";

import { searchResults } from "../cdtn-api";

const MyTableFooter = ({ onAddClick, onRefreshClick }) => (
  <TableFooter>
    <TableRow>
      <TableCell>
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
          <AddBoxIcon size={16} style={{ marginRight: 10 }} />
          Ajouter une référence
        </Button>
      </TableCell>
      <TableCell />
      <TableCell>
        <Button
          onClick={onRefreshClick}
          size="small"
          style={{ whiteSpace: "nowrap", marginTop: 20 }}
          variant="contained"
        >
          <RefreshIcon size={16} style={{ marginRight: 10 }} />
          Charger depuis CDTN
        </Button>
      </TableCell>
      <TableCell />
    </TableRow>
  </TableFooter>
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
        <TableHead>
          <TableRow>
            {["Résultat", "-", "Pertinence"].map(col => (
              <TableCell key={col}>{col}</TableCell>
            ))}
            <TableCell key="remove">-</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {values &&
            values.map(
              (row, index) =>
                row && (
                  <TableRow index={index} key={row + index}>
                    <TableCell>
                      <CDTNPicker
                        query={getRowId(row) || ""}
                        fetchSuggestions={searchResults}
                        onSelect={value => setRowValue(index, value)}
                      />
                    </TableCell>
                    <TableCell style={{ width: 25, padding: 0 }}>
                      <IconButton
                        aria-label="Preview"
                        onClick={() => {
                          const CDTN_URL =
                            "https://codedutravail-dev.num.social.gouv.fr";
                          const url =
                            row.url[0] === "/"
                              ? `${CDTN_URL}${row.url}`
                              : row.url;
                          window.open(url);
                        }}
                      >
                        <OpenInNewIcon size="medium" />
                      </IconButton>
                    </TableCell>
                    <TableCell
                      style={{ width: 250, padding: 0 }}
                      align="center"
                    >
                      <Relevance
                        value={row.relevance}
                        onChange={value => setRowRelevance(index, value)}
                      />
                    </TableCell>
                    <TableCell style={{ width: 25, padding: 0 }}>
                      <IconButton
                        aria-label="Supprimer"
                        onClick={() => {
                          onRemoveClick({ remove, index });
                        }}
                      >
                        <DeleteIcon size="medium" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
            )}
        </TableBody>
        <MyTableFooter
          onAddClick={onAddClick}
          onRefreshClick={onRefreshClick}
        />
      </Table>
    )}
  />
);

export default References;
