//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Own Components
import DeleteQuest from "./DeleteQuest";
import QuestDialog from "./QuestDialog";
import FollowButton from "./FollowButton";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

//Redux
import { connect } from "react-redux";

//Utilities
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//JSS
const styles = {
  card: {
    position: "relative",
    display: "flex",
    marginBottom: 50
  },
  image: {
    objectFit: "cover",
    margin: "0 25px 0 0",
    height: "150px",
    width: "150px",
    borderRadius: "10px",
    position: "relative",
    left: "20px",
    top: "-30px",
    transition: "all 0.4s ease-in-out",
    cursor: "pointer",
    boxShadow:
      "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 255, 255,.5)",
    "&:hover": {
      transform: "scale(1.1)",
      boxShadow:
        "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 255, 255,.2)"
    }
  },
  content: {
    padding: "15px 15px 15px 25px",
    objectFit: "cover"
  },
  timeAndGame: {
    margin: "5px 0 5px 0"
  },
  hrProfile: {
    width: "30vw",
    margin: "0px 0 10px 0"
  },
  timestampText: {
    margin: "0px 0 10px 0",
    fontSize: "0.75rem"
  }
};

/**
 * Quest class component
 *
 * This component represents a quest. It holds all the information of the quest and
 * the buttons needed for interaction purposes.
 */
class Quest extends Component {
  render() {
    //Used to calculate the time which passed since the quest was send
    dayjs.extend(relativeTime);
    //Props which got loaded by the stores state
    const {
      classes,
      quest: {
        body,
        createdAt,
        userImage,
        username,
        questId,
        fellowCount,
        commentCount,
        game,
        time
      },
      user: {
        authenticated,
        credentials: { name }
      }
    } = this.props;

    //If the quest is yours you can see the delete button
    const deleteButton =
      authenticated && username === name ? (
        <DeleteQuest questId={questId} />
      ) : null;

    //Renders the quest with all the derived data
    return (
      <Paper className={classes.card}>
        <Link to={`/user/${username}`}>
          <img alt="Profile" src={userImage} className={classes.image} />
        </Link>
        <div className={classes.content}>
          <Typography
            variant="h6"
            component={Link}
            to={`/user/${username}`}
            color="primary"
          >
            {" "}
            {username}
          </Typography>
          {deleteButton}
          <div className={classes.timeAndGame}>
            <Typography variant="body2" color="textSecondary">
              {" "}
              Game: {game} | Time: {time}
            </Typography>
          </div>
          <Typography variant="body1" color="textSecondary">
            {" "}
            {body}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
            className={classes.timestampText}
          >
            {" "}
            {dayjs(createdAt).fromNow()}
          </Typography>
          <hr className={classes.hrProfile} />
          <FollowButton questId={questId} />
          <span>{fellowCount} Fellowship </span>
          <QuestDialog
            questId={questId}
            username={username}
            openDialog={this.props.openDialog}
          />
          <span>{commentCount} Comments</span>
        </div>
      </Paper>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
Quest.propTypes = {
  user: PropTypes.object.isRequired,
  quest: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  user: state.user
});

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(mapStateToProps)(withStyles(styles)(Quest));
