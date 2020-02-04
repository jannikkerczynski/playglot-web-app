//React
import React from "react";
import PropTypes from "prop-types";

// MUI
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";

// Icons
import Skeleton from "@material-ui/lab/Skeleton";

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  name: {
    height: 20,
    backgroundColor: theme.palette.primary.main,
    width: 60,
    margin: "0 auto 7px auto"
  },
  fullLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "100%",
    marginBottom: 10
  },
  halfLine: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "50%",
    marginBottom: 10
  },
  halfLineCenter: {
    height: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "50%",
    marginBottom: 10,
    margin: "0 auto"
  },
  preloadProfile: {
    margin: "auto auto"
  }
});

/**
 * All Preload Elements should give the visual feedback of data being loaded.
 * This happens throught the Skeleton Component from the MUI Framework
 */
const PreloadProfile = props => {
  const { classes } = props;
  return (
    <Paper className={classes.paper}>
      <div className={classes.profile}>
        <div className="image-wrapper">
          <Skeleton
            variant="rect"
            width={210}
            height={200}
            className={classes.preloadProfile}
          />
        </div>
        <hr />
        <div className="profile-details">
          <Skeleton className={classes.name} variant="text" />
          <hr />
          <Skeleton className={classes.fullLine} variant="text" />
          <Skeleton className={classes.fullLine} variant="text" />
          <hr />
          <Skeleton className={classes.halfLineCenter} variant="text" />
          <hr />
          <Skeleton className={classes.halfLineCenter} variant="text" />
          <hr />
          <Skeleton className={classes.halfLineCenter} variant="text" />
        </div>
      </div>
    </Paper>
  );
};

PreloadProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PreloadProfile);
