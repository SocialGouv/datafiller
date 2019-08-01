import React from "react";

import { Drawer, IconButton } from "@material-ui/core";

import { Menu as MenuIcon } from "@material-ui/icons";

const AppBar = ({ classes, handleDrawerToggle, drawerOpen, children }) => (
  <Drawer
    classes={{
      paper: classes.drawerPaper
    }}
    variant="permanent"
  >
    {children}
  </Drawer>
);

export default AppBar;
