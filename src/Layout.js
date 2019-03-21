import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";

import { Router } from "./routes";
import ListRecordsView from "../src/ListRecordsView";
import Drawer from "./Drawer";

const drawerWidth = 300;

const styles = theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 6,
    marginRight: 6
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    background: "#fcfcfc",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto"
  }
});

const DefaultLeftComponent = props =>
  (Router.query.bucket && Router.query.collection && (
    <ListRecordsView
      {...Router.query} // pass bucket, collection, record?
      onAddClick={async ({ client }) => {
        const result = await client
          .bucket(Router.query.bucket)
          .collection(Router.query.collection)
          .createRecord({});

        Router.pushRoute("record", {
          bucket: Router.query.bucket,
          collection: Router.query.collection,
          record: result.data.id
        });

        // hack
        setTimeout(() => {
          const target = document.querySelector("textarea[name='title']");
          if (target) {
            target.focus();
          }
        }, 200);
      }}
      onRecordClick={record => {
        Router.pushRoute("record", {
          bucket: Router.query.bucket,
          collection: Router.query.collection,
          record: record.id
        });
      }}
      intro="Restant à compléter"
    />
  )) ||
  null;

class Layout extends React.Component {
  state = {
    drawerOpen: !!this.props.LeftComponent
  };
  handleDrawerToggle = () => {
    this.setState(curState => ({ drawerOpen: !curState.drawerOpen }));
  };
  shouldComponentUpdate(nextProps) {
    console.log("shouldComponentUpdate", nextProps, this.props);
    return true;
  }
  render() {
    const {
      config,
      classes,
      LeftComponent,
      RightComponent,
      children
    } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        {LeftComponent && (
          <Drawer
            config={config}
            classes={classes}
            handleDrawerToggle={this.handleDrawerToggle}
            drawerOpen={this.state.drawerOpen}
          >
            <LeftComponent />
          </Drawer>
        )}
        <main className={classes.content}>
          {RightComponent && <RightComponent />}
          {children}
        </main>
      </div>
    );
  }
}

Layout.defaultProps = {
  LeftComponent: DefaultLeftComponent,
  RightComponent: null
};

export default withStyles(styles)(Layout);
