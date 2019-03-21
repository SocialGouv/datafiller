import React from "react";

import { Link } from "../src/routes";

import ListRecords from "../src/kinto/ListRecords";

import Badge from "@material-ui/core/Badge";

import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { QuestionAnswer as QuestionAnswerIcon } from "@material-ui/icons";

const ListRecordsView = ({
  bucket,
  collection,
  record,
  intro,
  onRecordClick
}) => {
  console.log("record", record);
  return (
    <ListRecords
      bucket={bucket}
      collection={collection}
      render={({ result }) => (
        <List dense={true} component="nav">
          {intro && (
            <React.Fragment>
              <ListItem button>
                <Badge color="primary" badgeContent={4}>
                  <ListItemText primary="En attente" />
                </Badge>
              </ListItem>
              <ListItem button>
                <Badge color="secondary" badgeContent={12}>
                  <ListItemText primary="Traités" />
                </Badge>
              </ListItem>
              <Divider />
            </React.Fragment>
          )}
          {result.data.map(item => (
            <ListItem
              selected={item.id === record}
              key={item.id}
              button
              onClick={() => onRecordClick(item)}
            >
              <ListItemIcon style={{ margin: 0 }}>
                <QuestionAnswerIcon />
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItem>
          ))}
        </List>
      )}
    />
  );
};

export default ListRecordsView;
