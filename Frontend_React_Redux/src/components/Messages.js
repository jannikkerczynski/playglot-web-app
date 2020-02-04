//React
import React, { Component } from "react";
import PropTypes from "prop-types";

//MUI
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

//Redux
import { connect } from "react-redux";

//Utilities
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//JSS
const styles = {
  card: {
    margin: "10px",
    padding: "10px 10px"
  },
  timestamp: {
    fontSize: "0.6rem",
    display: "block",
    padding: "0px 5px"
  },
  messageText: {
    display: "block"
  },
  name: {
    fontSize: "0.7rem",
    fontWeight: "700"
  }
};

/**
 * Messages class component
 *
 * Displays the single messages used in the Chat.
 * It displays it by the name, time and date since send.
 */
class Messages extends Component {
  render() {
    //Used to get the relative time, so we can calculate since when this messages is there
    dayjs.extend(relativeTime);
    //Props which got loaded by the stores state
    const {
      classes,
      message: { body, createdAt, sender }
    } = this.props;

    return (
      <Paper className={classes.card}>
        <Typography variant="body1" color="primary" className={classes.name}>
          {sender}
        </Typography>
        <Typography
          variant="body1"
          color="primary"
          className={classes.messageText}
        >
          {body}
        </Typography>
        <Typography
          variant="body2"
          color="primary"
          className={classes.timestamp}
        >
          {dayjs(createdAt).fromNow()}
        </Typography>
      </Paper>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
Messages.propTypes = {
  user: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  user: state.user
});

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(mapStateToProps)(withStyles(styles)(Messages));
