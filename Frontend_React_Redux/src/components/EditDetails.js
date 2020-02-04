//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

//Utilities
import CustomButton from "../utilities/CustomButton";

//Redux
import { connect } from "react-redux";
import { editUserDetails } from "../redux/actions/userActions";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

//Icons
import EditIcon from "@material-ui/icons/Edit";

//JSS
const styles = theme => ({
  ...theme.spreadThis,
  button: {
    float: "right",
    position: "absolute",
    right: "0px",
    bottom: "0px"
  }
});

/**
 * EditDetails class component
 *
 * The components holds a button which opens a dialog window to enter the person details.
 *
 * The state of the Component consists out of the entered details of the user and the open key which determines if the
 * dialog window is open or closed.
 */
class EditDetails extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      bio: "",
      likes: "",
      plays: "",
      speaks: "",
      learns: "",
      location: "",
      open: false
    };
  }

  //Opens the dialog window and calls the mapUserDetailsToState function
  handleOpen = () => {
    this.setState({
      open: true
    });
    this.mapUserDetailsToState(this.props.credentials);
  };

  //Closes the dialog window
  handleClose = () => {
    this.setState({
      open: false
    });
  };

  //Fills the form with credentials after the component did mount and maps them to the form
  componentDidMount() {
    const { credentials } = this.props;
    this.mapUserDetailsToState(credentials);
  }

  //Standard handle to change the inputs value
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  //Puts the credentials data into a object and calls the editUserDetails function with the object as parameter
  //Closes the dialog afterwards
  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      likes: this.state.likes,
      plays: this.state.plays,
      speaks: this.state.speaks,
      learns: this.state.learns,
      location: this.state.location
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  };

  //Sets the credentials to the components state which makes the form have the details already in use displayed
  mapUserDetailsToState = credentials => {
    this.setState({
      bio: credentials.bio ? credentials.bio : "",
      likes: credentials.likes ? credentials.likes : "",
      plays: credentials.plays ? credentials.plays : "",
      speaks: credentials.speaks ? credentials.speaks : "",
      learns: credentials.learns ? credentials.learns : "",
      location: credentials.location ? credentials.location : ""
    });
  };
  render() {
    //Props which got loaded by the stores state
    const { classes } = this.props;

    return (
      <Fragment>
        <CustomButton
          tip="Edit Details"
          onClick={this.handleOpen}
          btnClassName={classes.button}
        >
          <EditIcon color="primary" />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Edit your details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                multiline
                rows="3"
                placeholder="A short bio about yourself"
                className={classes.textField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="likes"
                type="text"
                label="What do you like?"
                placeholder="Football, Tennis, Architecture"
                className={classes.textField}
                value={this.state.likes}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="plays"
                type="text"
                label="What games do you play?"
                placeholder="Rocket League, League of Legends"
                className={classes.textField}
                value={this.state.plays}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="speaks"
                type="text"
                label="What languages do you speak?"
                placeholder="German, English, Spanish, ..."
                className={classes.textField}
                value={this.state.speaks}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="learns"
                type="text"
                label="What languages do you want to learn?"
                placeholder="Greek, Turkish, French, ..."
                className={classes.textField}
                value={this.state.learns}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="location"
                type="text"
                label="Where are you from?"
                placeholder="Country or City"
                className={classes.textField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  editUserDetails: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  credentials: state.user.credentials
});

export default connect(mapStateToProps, { editUserDetails })(
  withStyles(styles)(EditDetails)
);
