//React
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

//CSS
import "./App.css";

//MUI
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

//Utilities
import themeFile from "./utilities/theme";
import jwtDecode from "jwt-decode";
import axios from "axios";

//Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { SET_UNAUTHENTICATED } from "./redux/types";
import { logoutUser, getUserData } from "./redux/actions/userActions";

//Components
import Navbar from "./components/Navbar";
import AuthRoute from "./utilities/AuthRoute.js";

//Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import user from "./pages/user";
import messenger from "./pages/messenger";
import profileSearch from "./pages/profileSearch";
import logout from "./pages/logout";

//Stylesheet for the MuiThemeCreator
const stylesheet = createMuiTheme(themeFile);
const token = localStorage.FBIdToken;

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS
});

axios.defaults.baseURL = "https://europe-west1-playglot.cloudfunctions.net/api";

//This condition is used to evaluate if the token has expired or not.
if (token) {
  //We decode the token with jwtCode to access the key values
  const decodedToken = jwtDecode(token);
  //The Date.now() is in Milliseconds which is the reason for multipling the token key with 1000
  if (decodedToken.exp * 1000 < Date.now()) {
    //This means the token expired and we log out the user and send him to the homescreen
    window.location.href = "/";
    store.dispatch(logoutUser());
  } else {
    //This means the token is still valid and we authorize the user by using it in the headers and get his data
    store.dispatch({ type: SET_UNAUTHENTICATED });
    axios.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

/**
 * class App
 *
 * The component which gets rendered afterwards in the index.js
 * It is the root of all our components
 */
class App extends Component {
  render() {
    /**
     * MuiThemeProvider
     * Does what is says - It Provides the theme we give him to access it in the other components
     *
     * Provider
     * Provides the store which holds our states and recieves the actions
     *
     * Router
     * The Router makes it able to redirect users through the entere URL
     * Switch searches for Route children inside of itself and renders them if the path fits
     * The AuthRoute is a our own component to redirect the user if he is authenticated, so he cant get back to the login or signup page
     *
     * Navbar
     * The Navbar is rendered to navigate through the web app
     */
    return (
      <MuiThemeProvider theme={stylesheet}>
        <Provider store={store}>
          <Router>
            <Navbar />
            <div className="container">
              <Switch>
                <AuthRoute exact path="/" component={login} />
                <Route exact path="/home" component={home} />
                <AuthRoute exact path="/signup" component={signup} />
                <Route exact path="/user/:name" component={user} />
                <Route exact path="/messages" component={messenger} />
                <Route
                  exact
                  path="/user/:name/quest/:questId"
                  component={user}
                />
                <Route exact path="/users" component={profileSearch} />
                <Route exact path="/logout" component={logout} />
              </Switch>
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(App);
