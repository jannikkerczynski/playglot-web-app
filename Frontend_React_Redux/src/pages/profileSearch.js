//React
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";

//Own components
import ProfileForSearch from "../components/ProfileForSearch";
import PreloadQuests from "../utilities/PreloadComponents/PreloadQuests";

//Redux
import { connect } from "react-redux";
import { getAllUsers } from "../redux/actions/dataActions";

/**
 * The profileSearch component helps the user to fnd new users on the platform.
 *
 * The state holds all requested users.
 *
 * It consists of a MUI Paper which is wrapped in the MUI Grid.
 * The logo of playglot sits on the top area of the paper. Beneath there is a form
 * which takes all the user entered input.
 * The forms button triggers the handleSubmit function.
 */
class profileSearch extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      users: null
    };
  }

  //Gets all Users after the mounting
  componentDidMount() {
    this.props.getAllUsers();
  }

  render() {
    //Props which got loaded by the stores state
    const { users, loadingData } = this.props.data;
    //Reduce the filter to lowerCase so it can be matched better
    let filter = this.props.filter.toLowerCase();
    //Create the Profiles with the help of the filter
    let recentProfileMarkup = !loadingData ? (
      //If the loading data is true it will render the placeholder
      //If the loading data is false it will render all left over profiles
      users
        .filter(
          user =>
            user.name.toLowerCase().includes(filter) ||
            user.speaks.toLowerCase().includes(filter) ||
            user.plays.toLowerCase().includes(filter) ||
            user.likes.toLowerCase().includes(filter) ||
            user.location.toLowerCase().includes(filter) ||
            user.learns.toLowerCase().includes(filter)
        )
        .map(singleUser => (
          <ProfileForSearch key={singleUser.name} user={singleUser} />
        ))
    ) : (
      <PreloadQuests />
    );
    return (
      <Grid
        container
        direction="column"
        justify="flex-start"
        alignItems="center"
      >
        <Grid item sm={12}>
          {recentProfileMarkup}
        </Grid>
      </Grid>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
profileSearch.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  data: state.data,
  filter: state.data.filter
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  getAllUsers
};

//connect() connects the store and the component with each other
export default connect(mapStateToProps, mapActionToProps)(profileSearch);
