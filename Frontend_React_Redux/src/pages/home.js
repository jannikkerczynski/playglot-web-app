//React
import React, { Component } from "react";
import PropTypes from "prop-types";
//MUI
import Grid from "@material-ui/core/Grid";
//Own components
import Quest from "../components/Quest";
import Profile from "../components/Profile";
//Utlities
import PreloadQuests from "../utilities/PreloadComponents/PreloadQuests";
//React
import { getQuests } from "../redux/actions/dataActions";
import { connect } from "react-redux";

/**
 * The home component is the main site of the application.
 * It renders a Profile component and an all created Quest components.
 * Those are distributed in Grid from the MUI Imports.
 *
 * The state of the component holds the quests of the application.
 * This gets assigned to the quests from the redux state.
 *
 * The Quest are getting loaded when the component mounts.
 */
class home extends Component {
  state = {
    quests: null
  };

  componentDidMount() {
    this.props.getQuests();
  }

  render() {
    const { quests, loadingData } = this.props.data;
    let filter = this.props.filter.toLowerCase();
    let splittedFilter = filter.split(" ");

    //This function checks if a the filter is included in the given word and returns a boolean
    const foundWord = (word, filter) => {
      let found = false;
      for (let index = 0; index < filter.length; index++) {
        const element = filter[index];
        if (filter.length >= 2 && element === "") {
          break;
        }
        if (word.includes(element)) {
          found = true;
          break;
        }
      }

      return found;
    };

    //recentQuestsMarkup holds the different quest display options
    let recentQuestsMarkup = !loadingData ? (
      //Filters the quests after the input keywords used for the filter
      quests
        .filter(
          quest =>
            //Checks if a keyword is in a string
            foundWord(quest.game.toLowerCase(), splittedFilter) ||
            foundWord(quest.time.toLowerCase(), splittedFilter) ||
            foundWord(quest.body.toLowerCase(), splittedFilter)
        )
        //Maps all Quests which are left over by the filtering to the variable
        .map(quest => <Quest key={quest.questId} quest={quest} />)
    ) : (
      //Appears if the loadingData value is true
      <PreloadQuests />
    );
    return (
      <Grid container spacing={4} style={{ paddingTop: "25px" }}>
        <Grid item sm={8} xs={12}>
          {recentQuestsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
home.propTypes = {
  getQuests: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  data: state.data,
  filter: state.data.filter
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  getQuests
};

//connect() connects the store and the component with each other
export default connect(mapStateToProps, mapActionToProps)(home);
