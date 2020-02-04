//React
import React from "react";
//MUI
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

/**
 * CustomButton
 *
 * A Button which has a Tooltip around it and shows a passed children icon inside of it.
 * Its possible to include ClickEvents, Classes for both the Tooltip and the IconButton and the tip itself
 */
export default ({ children, onClick, tip, btnClassName, tipClassName }) => (
  <Tooltip title={tip} className={tipClassName} placement="top">
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  </Tooltip>
);
