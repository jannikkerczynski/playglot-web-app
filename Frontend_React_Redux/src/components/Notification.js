//React
import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// MUI
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

// Icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

// Redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../redux/actions/userActions";

//Utilities
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

/**
 * Notification class component
 *
 * The Notification consist out of a button, which opens a Menu in which the recent Notifications are shown.
 *
 * If the database has any Notifications it will fetch this data and distribute the number of notifications on a small badge
 * on top of the Button.
 * If the menu is opened it shows the last notifications.
 * They are clickable and send you to the related quest on click.
 *
 * The State of this component consist only of the AnchorEl which defines the MenuStyle
 */
class Notification extends Component {
  //constructor to initialize the state of the component
  state = {
    anchorEl: null
  };

  // Gets called when the button gets clicked
  handleOpen = event => {
    this.setState({ anchorEl: event.target });
  };

  //Get called when they windows closes
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  // Get called when the menuOpens
  // maps the recent notifcationsid with an read status of false.
  //Then gives them to the markNotificationsRead function to mark them as read on the server
  onMenuOpened = () => {
    let unreadNotificationsIds = this.props.notifications
      .filter(not => !not.read)
      .map(not => not.notificationId);
    this.props.markNotificationsRead(unreadNotificationsIds);
  };
  render() {
    //constructor to initialize the state of the component
    const notifications = this.props.notifications;
    const anchorEl = this.state.anchorEl;
    // To get the time relative from the notifications creation date
    dayjs.extend(relativeTime);

    let notificationsIcon;
    //If the notications exists and the array of notications is bigger than 0
    //It renders the notifcations.
    if (notifications && notifications.length > 0) {
      //If there are unread notifcations it renders badges on top of the button
      notifications.filter(not => not.read === false).length > 0
        ? (notificationsIcon = (
            <Badge
              badgeContent={
                notifications.filter(not => not.read === false).length
              }
              color="primary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : //If not it just gets rendered normal
          (notificationsIcon = <NotificationsIcon />);
    } else {
      //If there arent any new notifcations it also gets rendered normal
      notificationsIcon = <NotificationsIcon />;
    }
    //The actual markup of the notfications
    //If depends on what kind of notifcation this item receives.
    // It matches for each case a different text and a different icon.
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(not => {
          const verb = not.type === "fellowship" ? "joined" : "commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = "primary";
          const icon =
            not.type === "fellow" ? (
              <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            );

          return (
            <MenuItem key={not.notificationId} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                color="primary"
                variant="body1"
                to={`/users/${not.recipient}/quest/${not.questId}`}
              >
                {not.sender} {verb} your Quest {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          You have no notifications yet
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placement="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationsIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
Notification.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  notifications: state.user.notifications
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  markNotificationsRead
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(mapStateToProps, mapActionToProps)(Notification);
