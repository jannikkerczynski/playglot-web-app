//React
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import MessageIcon from "@material-ui/icons/Message";
import Input from "@material-ui/core/Input";
import Fab from "@material-ui/core/Fab";

//Icons
import HomeIcon from "@material-ui/icons/Home";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import RecentActorsRoundedIcon from "@material-ui/icons/RecentActorsRounded";

//Own Components
import Notification from "./Notification";
import PostQuest from "./PostQuest";

//Redux
import { connect } from "react-redux";
import { setFilter } from "../redux/actions/dataActions";
import { logoutUser } from "../redux/actions/userActions";

//Utilities
import CustomButton from "../utilities/CustomButton";

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  title: {
    color: "white",
    marginLeft: "20px"
  },
  navContainer: {
    display: "flex",
    margin: "0 auto",
    minHeight: "50px",
    width: "1200px"
  },
  navContainerLogin: {
    display: "flex",
    minHeight: "50px"
  },
  rightButtonDistancer: {
    margin: "0 10px 0 auto",
    padding: "5px 15px 5px 15px"
  },
  leftButtonDistancer: {
    margin: "0 24% 0 10px"
  },
  logoutButton: {
    marginLeft: "auto",
    backgroundColor: "transparent",
    color: "white",
    boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.0)",
    textAlign: "center",

    "&:hover": {
      background: "rgba(0, 0, 0, 0.1)"
    },
    "& a": {
      color: "white"
    }
  },
  filterField: {
    margin: "0 27vw 0 0",
    backgroundColor: "white",
    borderRadius: "5px",
    padding: "2px 10px"
  },
  navbar: { background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)" }
});

/**
 * Navbar class
 *
 * The Navbar is there to make navigation on the platform possible.
 * It contains different buttons which lead to different endpoints.
 * It also contains the filter input field and the logout button on the right of it.
 * The Navbar changes depending on the authentication state of the user.
 */
class Navbar extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      filter: ""
    };
  }
  //Changes the input in the component and also in the store
  handleChange = event => {
    this.props.setFilter(event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  };

  //Logs the user out
  handleLogout = event => {
    this.props.logoutUser();
  };
  render() {
    //Props which got loaded by the stores state
    const { authenticated, classes } = this.props;
    //Displays the navbar which fits the state of the authentication
    const navbar = (
      <Fragment>
        <AppBar position="fixed" className={classes.navbar}>
          {authenticated ? (
            <Toolbar className={classes.navContainer}>
              <Link to="/home">
                <CustomButton tip="Home">
                  <HomeIcon color="secondary" />
                </CustomButton>
              </Link>
              <Link to="/home">
                <PostQuest />
              </Link>
              <Link to="/messages">
                <CustomButton tip="Messenger">
                  <MessageIcon color="secondary" />
                </CustomButton>
              </Link>
              <Link to="/users">
                <CustomButton tip="Search for Users">
                  <RecentActorsRoundedIcon color="secondary" />
                </CustomButton>
              </Link>
              <form
                className={classes.filterField}
                noValidate
                autoComplete="off"
              >
                <Input
                  id="filter"
                  name="filter"
                  type="text"
                  label="Search"
                  placeholder="Filter for..."
                  color="secondary"
                  value={this.state.filter}
                  onChange={this.handleChange}
                  disableUnderline={true}
                  fullWidth
                />
              </form>

              <Notification />

              <Fab
                color="secondary"
                size="small"
                onClick={this.handleLogout}
                className={classes.logoutButton}
                href="/logout"
              >
                <ExitToAppIcon />
              </Fab>
            </Toolbar>
          ) : (
            <Toolbar className={classes.navContainerLogin}>
              <Link underline="none" to="/">
                <Typography variant="h6" className={classes.title}>
                  Playglot
                </Typography>
              </Link>

              <Button
                color="inherit"
                component={Link}
                to="/"
                className={classes.rightButtonDistancer}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                variant="outlined"
                to="/signup"
                className={classes.leftButtonDistancer}
              >
                Signup
              </Button>
            </Toolbar>
          )}
        </AppBar>
        <div style={{ height: "50px" }}></div>
      </Fragment>
    );
    return navbar;
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  filter: PropTypes.string,
  setFilter: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  filter: state.data.filter
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  setFilter,
  logoutUser
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(Navbar));
