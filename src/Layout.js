import Grid from "@material-ui/core/Grid";
import { withRouter } from "next/router";

import QueryList from "../src/QueryList";

const DefaultLeftComponent = withRouter(props => {
  return <QueryList selectedQuery={props.router.query.query} />;
});

import React from "react";

import { withStyles } from "@material-ui/core/styles";

import { CssBaseline } from "@material-ui/core";

import AppBar from "./AppBar";

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

class Layout extends React.Component {
  state = {
    drawerOpen: true
  };
  handleDrawerToggle = () => {
    this.setState(curState => ({ drawerOpen: !curState.drawerOpen }));
  };
  render() {
    const { config, classes, LeftComponent, RightComponent } = this.props;

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          config={config}
          classes={classes}
          handleDrawerToggle={this.handleDrawerToggle}
          drawerOpen={this.state.drawerOpen}
        >
          <LeftComponent />
        </AppBar>
        <main className={classes.content}>
          <RightComponent />
        </main>
      </div>
    );
  }
}

Layout.defaultProps = {
  LeftComponent: DefaultLeftComponent,
  RightComponent: () => null
};

export default withStyles(styles)(Layout);
