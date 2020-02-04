//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import AppIcon from "../imgs/playglot-logo-big.png";

//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  containerCard: {
    padding: "50px"
  },
  form: {
    textAlign: "center"
  },
  headerLogout: {
    margin: "0 0 25px 0"
  },
  textLogout: { margin: "0 0 25px 0" },
  playglotLogo: {
    width: "200px",
    height: "200px",
    margin: "20px auto 20px auto"
  }
});

/**
 * The logout component
 */
class logout extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
  }

  render() {
    //Props which got loaded by the stores state
    const { classes } = this.props;
    return (
      <Grid container className={classes.form}>
        <Grid item xs={2} md={8} />
        <Grid item xs={8} md={4}>
          <Paper elevation={3} className={classes.containerCard}>
            <img
              src={AppIcon}
              alt="Logo Playglot"
              className={classes.playglotLogo}
            />
            <Typography variant="h4" className={classes.headerLogout}>
              {" "}
              We are sad to see you go
            </Typography>
            <Typography className={classes.textLogout}>
              We hope to welcome you soon back. If you changed your mind and
              want to log back in, click the button below.
            </Typography>
            <Link to="/">
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonReLog}
              >
                Log back in
              </Button>
            </Link>
          </Paper>
        </Grid>
        <Grid item xs={2} md={1} />
      </Grid>
    );
  }
}

//withStyles to use the stylesheet provided in the JSS of this component
export default withStyles(styles)(logout);
