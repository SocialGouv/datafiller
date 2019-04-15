import React from "react";
import ReactDOM from "react-dom";

import ListRecords from "../src/kinto/ListRecords";
import KintoContext from "../src/kinto/KintoContext";

//import Badge from "@material-ui/core/Badge";

import List from "@material-ui/core/List";
import Fab from "@material-ui/core/Fab";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Add as AddIcon,
  QuestionAnswer as QuestionAnswerIcon,
  Home as HomeIcon
} from "@material-ui/icons";

import { Link } from "./routes";

const getBgColor = item => {
  if (item.refs && item.refs.filter(i => !!i.url).length > 0) {
    if (item.theme) {
      return "#d2ff8d";
    }
    return "#edffd1";
  } else if (item.theme) {
    return "#edffd1";
  }
  return "transparent";
};

const ListRecordsView = ({
  bucket,
  collection,
  record,
  intro,
  onAddClick,
  onRecordClick
}) => (
  <ListRecords
    bucket={bucket}
    collection={collection}
    render={({ result }) => (
      <React.Fragment>
        <List
          dense={true}
          component="nav"
          style={{
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            height: "100vh"
          }}
        >
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Accueil" />
            </ListItem>
          </Link>
          <Divider />
          <div style={{ flex: "1 0 100%", overflow: "scroll" }}>
            {result.data.map(item => (
              <ListItem
                selected={item.id === record}
                ref={node => {
                  // hack : position list to the current selected item
                  if (item.id === record) {
                    const me = ReactDOM.findDOMNode(node);
                    if (me) {
                      me.parentNode.scrollTop = me.offsetTop - me.offsetHeight;
                    }
                  }
                }}
                key={item.id}
                button
                onClick={() => onRecordClick(item)}
                style={{
                  backgroundColor: item.id !== record && getBgColor(item)
                }}
              >
                <ListItemIcon style={{ margin: 0 }}>
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </div>
        </List>
        <KintoContext.Consumer>
          {({ client }) => (
            <Fab
              onClick={() => onAddClick({ client })}
              color="primary"
              title="Créer un nouvel enregistrement"
              style={{ bottom: 10, right: 10, position: "fixed" }}
            >
              <AddIcon />
            </Fab>
          )}
        </KintoContext.Consumer>
      </React.Fragment>
    )}
  />
);

export default ListRecordsView;
