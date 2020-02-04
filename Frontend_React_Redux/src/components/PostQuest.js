//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import CircualProgress from "@material-ui/core/CircularProgress";
import PostAdd from "@material-ui/icons/PostAdd";

//Redux
import { connect } from "react-redux";
import { postQuest, clearErrors } from "../redux/actions/dataActions";

//Utilities
import CustomButton from "../utilities/CustomButton";

//Icons
import CloseIcon from "@material-ui/icons/Close";

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  submitButton: {
    position: "relative",
    marginTop: "15px"
  },
  progressSpinner: {
    position: "absolute"
  },
  closeButton: {
    position: "absolute",
    left: "90%",
    top: "10%"
  }
});

/**
 * PostQuest class component
 *
 * The postQuest component is a dialog which makes the posting of quests possible to the user.abs
 *
 * The state of it contains the open key, the entered body,game and time data and the errors which will be set
 * according to the error reponse from the server.
 *
 *
 */
class PostQuest extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      open: false,
      body: "",
      game: "",
      time: "",
      errors: {}
    };
  }

  // If errors are received they will be put into the error fields of the state
  // If there are no errors or and we load everything gets reset
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.UI.errors) {
      return {
        errors: nextProps.UI.errors
      };
    }
    if (!nextProps.UI.errors && nextProps.UI.loading) {
      return { body: "", open: false, errors: {} };
    }
    return null;
  }
  //Opens the window of the dialog
  handleOpen = () => {
    this.setState({
      open: true
    });
  };
  //Opens the window of the dialog
  handleClose = () => {
    this.props.clearErrors();
    this.setState({
      open: false,
      errors: {}
    });
  };
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleSubmit = event => {
    event.preventDefault();
    this.props.postQuest({
      body: this.state.body,
      game: this.state.game,
      time: this.state.time
    });
  };
  render() {
    const { errors } = this.state;
    const {
      classes,
      UI: { loading }
    } = this.props;
    return (
      <Fragment>
        <CustomButton onClick={this.handleOpen} tip="Open up a Quest">
          <PostAdd color="secondary" />
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
          <DialogTitle>Send a Quest</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                name="body"
                type="text"
                label="Questdetails"
                multiline
                row="4"
                placeholder="Enter your details"
                error={errors.body ? true : false}
                helperText={errors.body}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="game"
                type="text"
                label="Which game do you want to play?"
                placeholder="FIFA"
                error={errors.game ? true : false}
                helperText={errors.game}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <TextField
                name="time"
                type="text"
                label="Which time do you want to play?"
                placeholder="13.03 at 13:00 (MEZ)"
                error={errors.time ? true : false}
                helperText={errors.time}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
            <DialogActions>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
                onClick={this.handleSubmit}
              >
                Submit
                {loading && (
                  <CircualProgress
                    size={30}
                    className={classes.progressSpinner}
                  />
                )}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
PostQuest.propTypes = {
  postQuest: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  UI: state.UI
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  postQuest,
  clearErrors
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(PostQuest));
