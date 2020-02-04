//React
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

/**
 *
 * @param {*} component the given component which should be rendered afterwards
 *
 * AuthRoute should redirect the user if he is authenticated. This way he cant end up on the signup or login while authenticated.
 */
const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        //If we are authenticated redirect to the home page
        authenticated === true ? (
          <Redirect to="/home" />
        ) : (
          //Otherwise render the component
          <Component {...props} />
        )
      }
    />
  );
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

AuthRoute.propTypes = {
  user: PropTypes.object
};
export default connect(mapStateToProps)(AuthRoute);
