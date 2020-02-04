//React
import React, { Fragment } from "react";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";

import Skeleton from "@material-ui/lab/Skeleton";

//JSS
const styles = theme => ({
  paper: {
    padding: 0
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  listItem: {
    display: "flex"
  },
  listText: {
    margin: "0 0 0 15px"
  }
});

/**
 * All Preload Elements should give the visual feedback of data being loaded.
 * This happens throught the Skeleton Component from the MUI Framework
 */
const PreloadMessengerProfile = () => {
  const content = Array.from({ length: 8 }).map((item, index) => (
    <Fragment key={index}>
      <ListItem>
        <Skeleton variant="circle" width={60} height={60} />
        <Skeleton
          variant="text"
          width={100}
          height={15}
          style={{ marginLeft: "20px" }}
        />
      </ListItem>
      <Divider />
    </Fragment>
  ));

  return <Fragment>{content}</Fragment>;
};

PreloadMessengerProfile.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(PreloadMessengerProfile);
