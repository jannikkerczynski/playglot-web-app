//React
import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";

//Utilities
import dayjs from "dayjs";
import CustomButton from "../utilities/CustomButton";

//Icons
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import CalenderToday from "@material-ui/icons/CalendarToday";
import LocationOn from "@material-ui/icons/LocationOn";
import ThumbUp from "@material-ui/icons/ThumbUp";
import SportsEsports from "@material-ui/icons/SportsEsports";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import LocalLibrary from "@material-ui/icons/LocalLibrary";

//JSS
const styles = theme => ({
  paper: {
    padding: 0
  },
  imageWrapper: {
    display: "flex"
  },
  profileImage: {
    height: "150px",
    width: "150px",
    borderRadius: "10px",
    margin: "0 auto",
    transform: "translateY(-80px)",
    objectFit: "cover"
  },
  bioText: {
    transform: "translateY(-50px)",
    color: "white"
  },
  username: {
    transform: "translateY(-60px)",
    alignText: "center"
  },

  usernameText: {
    color: "white"
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
  },
  list: {
    display: "block"
  },
  profileTop: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    alignText: "center"
  },
  chatButton: {
    position: "absolute",
    backgroundColor: "white",
    transform: "translate(-30%,-30%)",
    "& hover": {
      backgroundColor: "#ffffff22"
    }
  }
});

/**
 * StaticProfile class component
 *
 * It is the reduced version of the normal Profile.
 * It doesnt have the edit options which the original profile has, since this is a profile to only look at.
 * But it contains a button which adds the person to your messager.
 *
 */
const StaticProfile = props => {
  //Props which got loaded by the stores state
  const {
    classes,
    profile: {
      name,
      createdAt,
      imageUrl,
      bio,
      likes,
      plays,
      speaks,
      learns,
      location
    },
    onClick
  } = props;
  //Renders the static profile
  return (
    <Paper className={classes.paper}>
      <Link to={`/messages`}>
        <CustomButton
          tip="Click to Chat"
          btnClassName={classes.chatButton}
          onClick={onClick}
        >
          <ChatBubbleOutlineIcon />
        </CustomButton>
      </Link>
      <div className={classes.profileTop}>
        <div className={classes.imageWrapper}>
          <img alt={name} src={imageUrl} className={classes.profileImage} />
        </div>
        <Box className={classes.username}>
          <Typography
            variant="h4"
            align="center"
            className={classes.usernameText}
          >
            {name}
          </Typography>
        </Box>
        <Typography align="center" className={classes.bioText}>
          {bio}
        </Typography>
      </div>
      <List className={classes.list}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocationOn />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={location} secondary="From" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <RecordVoiceOver />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={speaks} secondary="Speaks" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalLibrary />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={learns} secondary="Learns" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ThumbUp />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={likes} secondary="Likes" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <SportsEsports />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={plays} secondary="Plays" />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <CalenderToday />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={dayjs(createdAt).format("MMM YYYY")}
            secondary="Joined"
          />
        </ListItem>
      </List>
    </Paper>
  );
};

//PropTypes checks our required attributes and warns us if they arent properly assigned
StaticProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

//withStyles to use the stylesheet provided in the JSS of this component
export default withStyles(styles)(StaticProfile);
