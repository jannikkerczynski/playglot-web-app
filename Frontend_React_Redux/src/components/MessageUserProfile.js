//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";

//Redux
import { connect } from "react-redux";
import { getMessages, setAddressed } from "../redux/actions/dataActions";

//JSS
const styles = theme => ({
  paper: {
    padding: 0
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7)
  },
  listItem: {
    display: "flex"
  },
  listText: {
    margin: "0 0 0 15px"
  }
});

/**
 * MessageUserProfile class component
 *
 * Contains the list items to display the users in the messenger component.
 * It displays them with their username and the img
 */
class MessageUserProfile extends Component {
  //constructor to initialize the state of the component
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      userImg: props.userImg
    };
  }
  render() {
    //Props which got loaded by the stores state
    const { classes } = this.props;
    //Index for the ListItem attribute which we will fill with the name later
    const selectedIndex = null;
    //After a list item gets clicked it taked the name and sets the addressed person and gets the messages together with that person.
    const handleListItemClick = (_event, username) => {
      this.props.setAddressed(username);
      this.props.getMessages(username);
    };
    return (
      <Fragment>
        <ListItem
          button
          selected={selectedIndex === this.state.name}
          onClick={event => handleListItemClick(event, this.state.name)}
          className={classes.listItem}
        >
          <ListItemAvatar>
            <Avatar
              src={this.state.userImg}
              alt={this.state.name}
              className={classes.large}
            />
          </ListItemAvatar>
          <ListItemText
            primary={this.state.name}
            className={classes.listText}
          />
        </ListItem>
        <Divider />
      </Fragment>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
MessageUserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  getMessages: PropTypes.func.isRequired,
  setAddressed: PropTypes.func.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  getMessages,
  setAddressed
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(MessageUserProfile));
