import React from "react";

import { Hidden, Drawer, IconButton } from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";

const AppBar = ({ classes, handleDrawerToggle, drawerOpen, children }) => (
  <React.Fragment>
    <div style={{ alignItems: "start" }}>
      <Hidden smUp>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
    </div>
    <Hidden smUp>
      <Drawer
        variant="temporary"
        classes={{
          paper: classes.drawerPaper
        }}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
      >
        {children}
      </Drawer>
    </Hidden>
    <Hidden xsDown>
      <Drawer
        classes={{
          paper: classes.drawerPaper
        }}
        variant="permanent"
        open
      >
        {children}
      </Drawer>
    </Hidden>
  </React.Fragment>
);

export default AppBar;
