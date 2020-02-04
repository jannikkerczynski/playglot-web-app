//React
import React, { Component } from "react";
import PropTypes from "prop-types";

//MUI
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import SendIcon from "@material-ui/icons/Send";

//Own components
import Messages from "../components/Messages";
import MessageUserProfile from "../components/MessageUserProfile";

//Redux
import { getUserData } from "../redux/actions/userActions";
import { connect } from "react-redux";
import { sendMessage, getAllUsers } from "../redux/actions/dataActions";

//Utlities
import PreloadMessages from "../utilities/PreloadComponents/PreloadMessages";
import PreloadMessengerProfile from "../utilities/PreloadComponents/PreloadMessengerProfile";

//JSS
const styles = {
  gridController: {
    flexGrow: "1"
  },
  profileGrid: {
    height: "600px",
    maxHeight: "600px",
    borderRadius: "10px",
    overflow: "auto"
  },
  list: {
    height: "600px",
    backgroundColor: "white",
    padding: 0
  },
  messagesGrid: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "0px",
    maxHeight: "545px",
    height: "100%",
    overflowY: "scroll",
    display: "flex",
    flexDirection: "column-reverse"
  },
  backgroundMessages: {
    backgroundColor: "white",
    borderRadius: "10px"
  },
  formGrid: {
    maxWidth: "900px"
  },
  formFormat: { backgroundColor: "white", display: "flex" },

  textField: { flexGrow: "1" },
  buttonSubmit: {
    flexGrow: "1",
    backgroundColor: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
  },
  messageBoxSender: {
    display: "inline-flex",
    marginLeft: "auto",
    textAlign: "right"
  },
  messageBoxRecipient: {
    display: "inline-flex",
    marginRight: "auto",
    textAlign: "left"
  },
  progress: {
    position: "absolute"
  }
};

/**
 * The Messenger Component makes it possible to communicate with other users on Playglot.
 *
 * The state consist of the body, which is used to keep track of the input field, and
 * the users which are on the Messengerlist of the logged user.
 *
 * When this component mounts it downloads all the user information
 */
class messenger extends Component {
  //State of this component
  constructor() {
    super();
    this.state = {
      body: "",
      users: null
    };
  }

  //As soon as the component mounts it triggers the getAllUsers() function
  componentDidMount() {
    this.props.getAllUsers();
  }

  //As soon as the user submits the entered message it will be put into an object and called with the sendMessage function
  handleSubmit = event => {
    event.preventDefault();
    const userMessage = {
      body: this.state.body
    };
    this.props.sendMessage(userMessage, this.props.data.addressed);
    this.setState({
      body: ""
    });
  };

  //Standard handle to change the inputs value
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    //props which got loaded by the stores state
    const { messages, loadingData, users, addressed } = this.props.data;
    const { classes } = this.props;
    const {
      loadingUser,
      credentials: { messagedUsers }
    } = this.props.user;

    //Creates a Date out of the createdAt value
    messages.forEach(message => {
      message.createdAt = new Date(message.createdAt);
    });

    // The function to organize the Messages
    // If the data is still loading the Preload Messages will be shown
    // If the data got loaded it will be shown
    let recentMessagesMarkup = !loadingData ? (
      messages
        //sorts the messages with the date as a key
        .sort((a, b) => b.createdAt - a.createdAt)
        //Wraps the Message in a div and decides on the author which style it gets
        .map(message => {
          const messageBlock = (
            <div
              key={message.createdAt}
              className={
                message.recipient === addressed
                  ? classes.messageBoxSender
                  : classes.messageBoxRecipient
              }
            >
              <Messages message={message} />
            </div>
          );
          return messageBlock;
        })
    ) : messages.length > 0 ? (
      <PreloadMessages />
    ) : (
      <div></div>
    );

    // Creates a list with all messaged users inside of it
    // If its loading it will show the placeholder
    let recentTalkPartners = !loadingUser ? (
      //If the messagedUsers are not undefined it will render the list
      messagedUsers !== undefined ? (
        messagedUsers.map(username => {
          let profilePicture = null;
          users.forEach(user => {
            if (user.name === username) {
              profilePicture = user.imageUrl;
            }
          });

          const profileBlock = (
            <MessageUserProfile
              key={username}
              name={username}
              userImg={profilePicture}
            />
          );
          return profileBlock;
        })
      ) : (
        <PreloadMessengerProfile />
      )
    ) : (
      //If the messagedUsers ist empty it will render the this
      <Typography>Please add someone by going to there profile</Typography>
    );
    return (
      <div className={classes.gridController}>
        <Grid
          container
          spacing={4}
          direction="row"
          justify="flex-end"
          className={classes.totalContainer}
        >
          <Grid container item xs={12} spacing={4}>
            <Grid item xs={3} className={classes.profileGrid}>
              <List component="nav" aria-label="Users" className={classes.list}>
                {recentTalkPartners}
              </List>
            </Grid>
            <Grid item xs={9}>
              <div className={classes.messagesGrid}>{recentMessagesMarkup}</div>
            </Grid>
          </Grid>
          <Grid item xs={9} className={classes.formGrid}>
            <form
              noValidate
              onSubmit={this.handleSubmit}
              className={classes.formFormat}
            >
              <TextField
                id="body"
                name="body"
                type="text"
                fullWidth
                multiline
                value={this.state.body}
                rows="3"
                disabled={loadingData}
                placeholder="Write a message..."
                variant="outlined"
                onChange={this.handleChange}
                className={classes.textField}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                className={classes.buttonSubmit}
                disabled={loadingData || addressed === ""}
              >
                <SendIcon style={{ transform: "rotate(-45deg)" }} />
                {loadingData && (
                  <CircularProgress size="25px" className={classes.progress} />
                )}
              </Button>
            </form>
          </Grid>
        </Grid>
      </div>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
messenger.propTypes = {
  data: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  getUserData: PropTypes.func.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  data: state.data,
  user: state.user
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  getAllUsers,
  sendMessage,
  getUserData
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(messenger));
