//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Redux
import { connect } from "react-redux";
import { followQuest, unfollowQuest } from "../redux/actions/dataActions";

//Utilities
import CustomButton from "../utilities/CustomButton";

//Icons
import People from "@material-ui/icons/People";
import PeopleBorder from "@material-ui/icons/PeopleOutline";

/**
 * FollowButton class component
 *
 * This component contains the follow button which is showns in a quest
 * It checks if we already follow a quest or not and displays a different icon after that condition
 */
export class FollowButton extends Component {
  //Checks which quests we already follow
  followedQuest = () => {
    if (
      this.props.user.fellowCount &&
      this.props.user.fellowCount.find(
        fellowCount => fellowCount.questId === this.props.questId
      )
    ) {
      return true;
    } else return false;
  };

  // Calls the followQuest function with the quest id of the followed quest
  followQuest = () => {
    this.props.followQuest(this.props.questId);
  };
  // Calls the unfollowQuest function with the quest id of the unfollowed quest
  unfollowQuest = () => {
    this.props.unfollowQuest(this.props.questId);
  };

  render() {
    //Props which got loaded by the stores state
    const { authenticated } = this.props.user;
    //Checks the Buttons displayed state
    //If followed the icon is displayed with a filled core
    //If notfollowed the icon is displayed with a filled border but empty core
    const fellowButton = !authenticated ? (
      <Link to="/login">
        <CustomButton tip="Follow">
          <PeopleBorder color="primary" />
        </CustomButton>
      </Link>
    ) : this.followedQuest() ? (
      <CustomButton tip="Undo fellowship" onClick={this.unfollowQuest}>
        <People color="primary" />
      </CustomButton>
    ) : (
      <CustomButton tip="Follow" onClick={this.followQuest}>
        <PeopleBorder color="primary" />
      </CustomButton>
    );
    return fellowButton;
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
FollowButton.propTypes = {
  user: PropTypes.object.isRequired,
  questId: PropTypes.string.isRequired,
  followQuest: PropTypes.func.isRequired,
  unfollowQuest: PropTypes.func.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  user: state.user
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionsToProps = {
  followQuest,
  unfollowQuest
};

//connect() connects the store and the component with each other
export default connect(mapStateToProps, mapActionsToProps)(FollowButton);
