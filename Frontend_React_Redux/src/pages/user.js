//React
import React, { Component } from "react";
import PropTypes from "prop-types";
//Axios for http requests
import axios from "axios";

//Own Components
import Quest from "../components/Quest";
import StaticProfile from "../components/StaticProfile";

//Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/dataActions";
import { addMessagedUser } from "../redux/actions/userActions";

//MUI
import Grid from "@material-ui/core/Grid";

//Utilities
import PreloadQuests from "../utilities/PreloadComponents/PreloadQuests";
import PreloadProfile from "../utilities/PreloadComponents/PreloadProfile";
/**
 * The user component shows the profile and quests of a specific user.
 *
 * The state holds the profile and the quest id parameters.
 */
class user extends Component {
  constructor() {
    super();
    this.state = {
      profile: null,
      questIdParam: null
    };
  }

  /**
   * After the component mounts it keeps the name and questid as variables.
   * If the quest id exists it will be set as the state quest id.
   * Then we make a request to fetch the data for the user and save it in the local profile state.
   */
  componentDidMount() {
    const name = this.props.match.params.name;
    const questId = this.props.match.params.questId;

    if (questId) this.setState({ questIdParam: questId });

    this.props.getUserData(name);
    axios
      .get(`/user/${name}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        });
      })
      .catch(err => console.log(err));
  }

  //When the user clicks on the profile message button he will add the person to the messenger list
  handleClick = () => {
    this.props.addMessagedUser(this.state.profile.name);
  };

  render() {
    //props which got loaded by the stores state

    const { questIdParam } = this.state;
    const { quests, loadingData } = this.props.data;
    //The quests get created in this variable
    const questsMarkup = loadingData ? (
      //Preload if its loading
      <PreloadQuests />
    ) : quests === null ? (
      //No quests are available if quests arent created yet
      <p>No Quests available by this fellow Friend</p>
    ) : !questIdParam ? (
      //If the param isnt available render all quests
      quests.map(quest => <Quest key={quest.questId} quest={quest} />)
    ) : (
      //If the param is there check if the quest id is the same as the param and render the quests then
      quests.map(quest => {
        if (quest.questId !== questIdParam)
          return <Quest key={quest.questId} quest={quest} />;
        else {
          //if the param and the quest id are equal open the dialog to have the specific quest
          return <Quest key={quest.questId} quest={quest} openDialog />;
        }
      })
    );
    return (
      <Grid container spacing={4} style={{ paddingTop: "25px" }}>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? (
            <PreloadProfile />
          ) : (
            <StaticProfile
              profile={this.state.profile}
              onClick={this.handleClick}
            />
          )}
        </Grid>
        <Grid item sm={8} xs={12}>
          {questsMarkup}
        </Grid>
      </Grid>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
user.propTypes = {
  getUserData: PropTypes.func.isRequired,
  addMessagedUser: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  data: state.data
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  getUserData,
  addMessagedUser
};

//connect() connects the store and the component with each other
export default connect(mapStateToProps, mapActionToProps)(user);
