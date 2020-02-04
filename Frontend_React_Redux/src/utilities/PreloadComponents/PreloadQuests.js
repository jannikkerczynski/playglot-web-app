import React, { Fragment } from "react";
import PropTypes from "prop-types";
// MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

import withStyles from "@material-ui/core/styles/withStyles";
import Skeleton from "@material-ui/lab/Skeleton";

const styles = theme => ({
  ...theme.spreadThisCSS,
  card: {
    display: "flex",
    marginBottom: 20
  },
  cardContent: {
    width: "100%",
    flexDirection: "column",
    padding: 25
  },
  cover: {},
  name: {
    width: 60,
    height: 18,
    backgroundColor: theme.palette.primary.main,
    marginBottom: 7
  },
  date: {
    height: 14,
    width: 100,
    backgroundColor: "rgba(0,0,0, 0.3)",
    marginBottom: 10
  },
  fullLine: {
    height: 15,
    width: "90%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10
  },
  halfLine: {
    height: 15,
    width: "50%",
    backgroundColor: "rgba(0,0,0, 0.6)",
    marginBottom: 10
  }
});

/**
 * All Preload Elements should give the visual feedback of data being loaded.
 * This happens throught the Skeleton Component from the MUI Framework
 */
const PreloadProfile = props => {
  const { classes } = props;

  const content = Array.from({ length: 5 }).map((item, index) => (
    <Card className={classes.card} key={index}>
      <CardMedia>
        <Skeleton
          variant="rect"
          width={200}
          height={200}
          className={classes.cover}
        />
      </CardMedia>
      <CardContent className={classes.cardContent}>
        <Skeleton className={classes.name} />
        <Skeleton className={classes.fullLine} />
        <Skeleton className={classes.date} />
        <Skeleton className={classes.fullLine} />
        <Skeleton className={classes.halfLine} />
      </CardContent>
    </Card>
  ));

  return <Fragment>{content}</Fragment>;
};

PreloadProfile.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PreloadProfile);
