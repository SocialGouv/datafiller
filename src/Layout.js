import React from "react";

import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";

import ListRecordsView from "../src/ListRecordsView";
import Drawer from "./Drawer";

import { withRouter } from "next/router";

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
    whiteSpace: "nowrap",
    background: "#fcfcfc",
    width: "100%",
    position: "relative"
  },

  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    height: "100vh",
    overflow: "auto"
  }
});

export const _LeftCol = props =>
  (props.router.query.bucket && props.router.query.collection && (
    <ListRecordsView
      {...props.router.query}
      onAddClick={async ({ client }) => {
        const result = await client
          .bucket(props.router.query.bucket)
          .collection(props.router.query.collection)
          .createRecord({ title: "", refs: [{}] });

        props.router.push(
          `/bucket/${props.router.query.bucket}/collection/${props.router.query.collection}/record/${result.data.id}`
        );

        // hack
        setTimeout(() => {
          const target = document.querySelector("textarea[name='title']");
          if (target) {
            target.focus();
          }
        }, 200);
      }}
      intro="Restant à compléter"
    />
  )) ||
  null;

const LeftCol = withRouter(_LeftCol);

class Layout extends React.Component {
  state = {
    drawerOpen: !!this.props.LeftComponent
  };
  handleDrawerToggle = () => {
    this.setState(curState => ({ drawerOpen: !curState.drawerOpen }));
  };
  shouldComponentUpdate(nextProps) {
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
      <Grid container>
        <Grid item xs={3}>
          <Drawer
            config={config}
            classes={classes}
            handleDrawerToggle={this.handleDrawerToggle}
            drawerOpen={this.state.drawerOpen}
          >
            <LeftCol />
          </Drawer>
        </Grid>
        <Grid item xs={9}>
          <main className={classes.content}>
            {RightComponent && <RightComponent />}
            {children}
          </main>
        </Grid>
      </Grid>
    );
  }
}

Layout.defaultProps = {
  //LeftComponent: withRouter(DefaultLeftComponent),
  RightComponent: null
};

export default withStyles(styles)(Layout);
