import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { QuestionAnswer as QuestionAnswerIcon } from "@material-ui/icons";

import { Link } from "./routes";

const styles = theme => ({
  queryList: {
    backgroundColor: theme.palette.background.paper
  }
});

// const DEFAULT_ITEMS = [
//   ["convention collective", "trouver ma convention collective"],
//   ["convention collective boulangerie"],
//   ["rupture cdd"],
//   ["abandon de poste"]
// ].map(item => ({ id: item.join(", "), title: item.join(", ") }));

const data = require("../example.json");

const getItems = () => data.map(x => x.query);

const QueryList = ({ classes, selectedQuery }) => (
  <div className={classes.queryList}>
    <List dense={true} component="nav">
      {getItems().map(item => (
        <Link key={item} route="query" params={{ query: item }}>
          <ListItem button selected={item === selectedQuery}>
            <ListItemIcon style={{ margin: 0 }}>
              <QuestionAnswerIcon />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        </Link>
      ))}
    </List>
  </div>
);

export default withStyles(styles)(QueryList);
