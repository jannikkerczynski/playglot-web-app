//React
import React, { Fragment } from "react";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Skeleton from "@material-ui/lab/Skeleton";

const styles = theme => ({
  ...theme.spreadThisCSS,
  halfLineLeft: {
    display: "flex",
    height: 10,
    width: "20%",
    backgroundColor: "rgba(255,142,62, 0.6)",
    marginBottom: 10
  },
  halfLineRight: {
    display: "flex",
    marginLeft: "auto",
    height: 10,
    width: "20%",
    backgroundColor: "rgba(255,142,62, 0.6)",
    marginBottom: 10
  },
  halfLineLeftsmaller: {
    display: "flex",
    height: 10,
    width: "10%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10
  },
  halfLineRightsmaller: {
    display: "flex",
    marginLeft: "auto",
    height: 10,
    width: "10%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10
  },
  halfLineLeftsmaller2x: {
    display: "flex",
    height: 10,
    width: "5%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10
  },
  halfLineRightsmaller2x: {
    display: "flex",
    marginLeft: "auto",
    height: 10,
    width: "5%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10
  }
});

/**
 * All Preload Elements should give the visual feedback of data being loaded.
 * This happens throught the Skeleton Component from the MUI Framework
 */
const PreloadMessages = props => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((item, index) => (
    <div key={index}>
      <Skeleton className={classes.halfLineRight} />
      <Skeleton className={classes.halfLineRightsmaller} />
      <Skeleton className={classes.halfLineRightsmaller2x} />
      <Skeleton className={classes.halfLineLeft} />
      <Skeleton className={classes.halfLineLeftsmaller} />
      <Skeleton className={classes.halfLineLeftsmaller2x} />
    </div>
  ));

  return <Fragment>{content}</Fragment>;
};

PreloadMessages.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PreloadMessages);
