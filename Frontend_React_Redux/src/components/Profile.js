//React
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//Own components
import EditDetails from "./EditDetails.js";

//Utilities
import dayjs from "dayjs";
import CustomButton from "../utilities/CustomButton";
import PreloadProfile from "../utilities/PreloadComponents/PreloadProfile";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

//Icons
import LocationOn from "@material-ui/icons/LocationOn";
import CalenderToday from "@material-ui/icons/CalendarToday";
import ThumbUp from "@material-ui/icons/ThumbUp";
import SportsEsports from "@material-ui/icons/SportsEsports";
import RecordVoiceOver from "@material-ui/icons/RecordVoiceOver";
import LocalLibrary from "@material-ui/icons/LocalLibrary";
import ImageIcon from "@material-ui/icons/Image";

//Redux
import { connect } from "react-redux";
import { logoutUser, uploadImage } from "../redux/actions/userActions";

//JSS
const styles = theme => ({
  paper: {
    padding: 0,
    position: "relative"
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
  paperLoading: {
    display: "flex",
    flexWrap: "wrap",
    padding: 20,
    justifyContent: "center"
  },
  loginText: {
    marginTop: "15px",
    flex: "0 0 100%"
  },
  buttons: {
    margin: "15px 10px"
  },
  editPicture: {
    position: "absolute",
    top: "0",
    right: "0",
    color: "white"
  }
});

/**
 * Profile class
 *
 * This is the main profile. It displays all the data a user can enter.
 * It contains a profile image, the name of the logged user, his biography
 * and all the dates he wants to enter by himself.
 *
 * It contains buttons to upload a image for your profile and to edit your person data.
 */
class Profile extends Component {
  //It assigns the choosen file to to variable and puts it into a formData object.
  //Afterwards we call the uploadImage function and give it the newly made formData object containing our image.
  handleImageChange = event => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadImage(formData);
  };

  // It opens the fileInput window
  handleEditPicture = () => {
    const fileInput = document.getElementById("imageUpload");
    fileInput.click();
  };

  render() {
    //Props which got loaded by the stores state
    const {
      classes,
      user: {
        credentials: {
          name,
          createdAt,
          imageUrl,
          bio,
          speaks,
          learns,
          likes,
          plays,
          location
        },
        loadingUser,
        authenticated
      }
    } = this.props;

    //This profilemarkup checks if we are still loading the user data and if the user is authenticated.
    //Depending on those conditions the users see a Preloaded version of the profile, is asked to login or sign up
    //Or shown his own profile
    let profileMarkup = !loadingUser ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profileTop}>
            <div className={classes.imageWrapper}>
              <img alt={name} src={imageUrl} className={classes.profileImage} />
            </div>
            <input
              type="file"
              id="imageUpload"
              hidden="hidden"
              onChange={this.handleImageChange}
            />
            <CustomButton
              tip="Edit profile photo"
              onClick={this.handleEditPicture}
              btnClassName={classes.editPicture}
            >
              <ImageIcon />
            </CustomButton>
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
              <ListItemText primary={plays} secondary="plays" />
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
          <EditDetails />
        </Paper>
      ) : (
        <Paper className={classes.paperLoading}>
          <Typography
            variant="body2"
            align="center"
            className={classes.loginText}
          >
            Sorry dear Friend, it seems like you are logged out. Try to log in
            or sign up.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            className={classes.buttons}
            to="/"
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            className={classes.buttons}
            to="/signup"
          >
            Signup
          </Button>
        </Paper>
      )
    ) : (
      <PreloadProfile />
    );
    return profileMarkup;
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  uploadImage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  user: state.user
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionsToProps = {
  logoutUser,
  uploadImage
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Profile));
