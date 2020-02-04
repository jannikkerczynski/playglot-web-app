//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../imgs/playglot-logo-big.png";

//MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

//Redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  containerCard: {
    padding: "50px"
  },
  form: {
    textAlign: "center"
  },
  playglotLogo: {
    width: "200px",
    height: "200px",
    margin: "20px auto 20px auto"
  },
  pageTitle: {
    margin: "10px auto 10px auto"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  buttonLogin: {
    margin: "40px auto 20px auto"
  }
});

/**
 * The login component helps the user to log into the web application.
 *
 * Its state holds the entered email and password. It also holds the errors which
 * are filled if there happened an error with the verification.
 *
 * It consists of a MUI Paper  which is wrapped in the MUI Grid.
 * The logo of playglot sits on the top area of the paper. Beneath there is a form
 * which takes all the user entered input.
 * The forms button triggers the handleSubmit function.
 */
class login extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
  }
  //As soon as errors arrive at the state.ui.errors this
  //function triggers and set the errors of this state equal to the errors it reveiced
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.UI.errors) {
      return { errors: nextProps.UI.errors };
    } else return null;
  }

  //Puts the login data into a object and calls the loginUser function with the object and the history as parameter
  handleSubmit = event => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  //Standard handle to change the inputs value
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    //Props which got loaded by the stores state
    const {
      classes,
      UI: { loading }
    } = this.props;
    //Deconstructs the errors from the state to the const errors
    const { errors } = this.state;
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
            <Typography variant="h4" className={classes.pageTitle}>
              Login
            </Typography>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                id="email"
                name="email"
                type="email"
                label="Email"
                helperText={errors.email}
                error={errors.email ? true : false}
                className={classes.TextField}
                value={this.state.email}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                id="password"
                name="password"
                type="password"
                label="Password"
                helperText={errors.password}
                error={errors.password ? true : false}
                className={classes.TextField}
                value={this.state.password}
                onChange={this.handleChange}
                fullWidth
              />
              {errors.general && (
                <Typography variant="body2" className={classes.customError}>
                  {errors.general}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.buttonLogin}
                disabled={loading}
              >
                Login
                {loading && (
                  <CircularProgress size="25px" className={classes.progress} />
                )}
              </Button>
              <Typography className={classes.redirect}>
                What? You dont have an Account. <br />
                <Link to="/signup">Let me lead you to the Sign Up.</Link>
              </Typography>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={2} md={1} />
      </Grid>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  loginUser
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(login));
