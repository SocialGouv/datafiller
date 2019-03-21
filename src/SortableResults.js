import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody
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

const Row = SortableElement(({ children, ...other }) => {
  return (
    <TableRow {...other}>
      <TableCell style={{ width: "5%" }}>
        <DragHandle />
      </TableCell>
      {children}
    </TableRow>
  );
});

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
          this.props.onReorder(this.state.results);
        }
      }
    );
  };

  render() {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell style={{ width: "5%" }}>&nbsp;</TableCell>
            {this.props.columns.map(col => (
              <TableCell key={col}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBodySortable
          onSortEnd={this.onSortEnd}
          useDragHandle
          displayRowCheckbox={false}
        >
          {this.state.results.map((row, index) => {
            return (
              row && (
                <Row index={index} key={row + index}>
                  {this.props.renderRow(row)}
                </Row>
              )
            );
          })}
          <Row key="new-input" index={this.state.results.length}>
            {this.props.renderRow({})}
          </Row>
        </TableBodySortable>
      </Table>
    );
  }
}

export default SortableResults;
