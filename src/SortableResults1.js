import React from "react";

import {
  Button,
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  TableFooter
} from "@material-ui/core";

import {
  SortableContainer,
  SortableHandle,
  SortableElement,
  arrayMove
} from "react-sortable-hoc";

const DragHandle = SortableHandle(({ style }) => (
  <span style={{ ...style, ...{ cursor: "move" } }}>{"::::"}</span>
));

//
const TableBodySortable = SortableContainer(({ children }) => (
  <TableBody>{children}</TableBody>
));

TableBodySortable.muiName = "TableBody";

const SortableRow = SortableElement(({ children, ...other }) => (
  <TableRow {...other}>
    <TableCell style={{ width: "25px" }}>
      <DragHandle />
    </TableCell>
    {children}
  </TableRow>
));

class SortableResults extends React.Component {
  state = {
    results: this.props.results
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      results: nextProps.results
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      {
        results: arrayMove(this.state.results, oldIndex, newIndex)
      },
      () => {
        if (this.props.onReorder) {
          this.props.onReorder(oldIndex, newIndex);
        }
      }
    );
  };
  renderRows = ({ Component = TableRow }) => (
    <React.Fragment>
      {this.state.results.map(
        (row, index) =>
          row && (
            <Component index={index} key={row + index}>
              {this.props.renderRow(row, index)}
            </Component>
          )
      )}
    </React.Fragment>
  );
  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "25px" }}>&nbsp;</TableCell>
            {this.props.columns.map(col => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {(this.state.results.length > 1 && (
          <TableBodySortable
            onSortEnd={this.onSortEnd}
            useDragHandle
            displayRowCheckbox={false}
          >
            {this.renderRows({ Component: SortableRow })}
          </TableBodySortable>
        )) || <TableBody>{this.renderRows({ Component: TableRow })}</TableBody>}
        <TableFooter>
          <TableRow key="new-input" index={this.state.results.length}>
            <Button
              size="small"
              color="primary"
              style={{ whiteSpace: "nowrap", marginTop: 20 }}
              variant="contained"
            >
              Ajouter une référence
            </Button>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}

export default SortableResults;
