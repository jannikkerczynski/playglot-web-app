//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//Own Components
import FollowButton from "./FollowButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";

//MUI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";

//Redux
import { connect } from "react-redux";
import { getQuest, clearErrors } from "../redux/actions/dataActions";

//Utilities
import dayjs from "dayjs";
import CustomButton from "../utilities/CustomButton";

//Icons
import ChatIcon from "@material-ui/icons/Chat";

//JSS
const styles = theme => ({
  ...theme.spreadthisCSS,
  profileImage: {
    boxShadow:
      "0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px rgba(255, 255, 255,.5)",
    maxWidth: 200,
    height: 200,
    borderRadius: "25px",
    objectFit: "cover"
  },
  dialogContent: {
    padding: 20
  },
  closeButton: {
    position: "absolute",
    left: "90%"
  },
  expandButton: {},
  spinnerDiv: {
    textAlign: "center",
    marginTop: 50,
    marginBottom: 50
  },
  bodyQuest: {
    margin: "15px 0 0 0"
  },
  marginbot: {
    margin: "auto 0 0 0"
  },
  containertextquest: {
    display: "flex",
    flexDirection: "column"
  }
});

/**
 * QuestDialog class
 *
 * The quest dialog is the dialog we see if we click on the comment or use a certain url path.
 * It contains the quest data itself, the comment input field and the comments themselves.
 *
 * The state holds the open key and the old and new path for the dialog.
 */
class QuestDialog extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      open: false,
      oldPath: "",
      newPath: ""
    };
  }
  //If the component mounts and the passed openDialog props is true it will open the dialog window
  componentDidMount() {
    if (this.props.openDialog) {
      this.handleOpen();
    }
  }

  //Handles the opening of the window
  handleOpen = () => {
    //Assigns the url path the window is on right now to the oldPath variable
    let oldPath = window.location.pathname;
    //Props which got loaded by the stores state
    const { username, questId } = this.props;
    //Sets the newPath to the username and the certains quest URL
    const newPath = `/user/${username}/quest/${questId}`;
    //Compares them and if they are the same it sets the oldpath to the the users profile URL
    if (oldPath === newPath) {
      oldPath = `/user/${username}`;
    }
    //Sets the NewPath as the URL
    window.history.pushState(null, null, newPath);
    //Updates the state
    this.setState({ open: true, oldPath, newPath });
    //gets the quest informations
    this.props.getQuest(this.props.questId);
  };

  handleClose = () => {
    //On close the user is send back to the oldPath
    window.history.pushState(null, null, this.state.oldPath);
    //The state is set to close the window
    this.setState({ open: false });
    //All errors which could have happend in the window are cleared
    this.props.clearErrors();
  };
  render() {
    //Props which got loaded by the stores state
    const {
      classes,
      quest: {
        questId,
        body,
        createdAt,
        fellowCount,
        commentCount,
        userImage,
        username,
        comments = []
      },
      UI: { loading }
    } = this.props;

    //If the global loading state is true it will show a preload Progress circle
    //When the loading has ended it will display the quest in a dialog window
    const dialogMarkup = loading ? (
      <CircularProgress size={20} />
    ) : (
      <Grid container spacing={4}>
        <Grid item sm={5}>
          <img src={userImage} alt="profile" className={classes.profileImage} />
        </Grid>
        <Grid item sm={7} className={classes.containertextquest}>
          <Typography
            component={Link}
            color="primary"
            variant="h5"
            to={`/user/${username}`}
          >
            {username}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
          </Typography>

          <Typography variant="body1" className={classes.bodyQuest}>
            {body}
          </Typography>
          <div className={classes.marginbot}>
            <FollowButton questId={questId} />
            <span>{fellowCount}</span>
            <CustomButton tip="Comments">
              <ChatIcon color="primary" />
            </CustomButton>
            <span>{commentCount}</span>
          </div>
        </Grid>
        <CommentForm questId={questId} />
        <Comments comments={comments} />
      </Grid>
    );
    return (
      <Fragment>
        <CustomButton
          onClick={this.handleOpen}
          tip="Expand Quest"
          tipClassName={classes.expandButton}
        >
          <ChatIcon color="primary" />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <CustomButton
            tip="Close"
            onClick={this.handleClose}
            btnClassName={classes.closeButton}
          >
            <CloseIcon />
          </CustomButton>
          <DialogContent className={classes.DialogContent}>
            {dialogMarkup}
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
QuestDialog.propTypes = {
  clearErrors: PropTypes.func.isRequired,
  getQuest: PropTypes.func.isRequired,
  questId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  quest: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  quest: state.data.quest,
  UI: state.UI
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionsToProps = {
  getQuest,
  clearErrors
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(QuestDialog));
