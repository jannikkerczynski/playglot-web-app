//React
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

//MUI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteOutline from "@material-ui/icons/DeleteOutline";

//Redux
import { connect } from "react-redux";
import { deleteQuest } from "../redux/actions/dataActions";

//Utilities
import CustomButton from "../utilities/CustomButton";

//JSS
const styles = {
  deleteButton: {
    position: "absolute",
    left: "90%",
    top: "10%"
  }
};

/**
 * DeleteQuest class component
 *
 * This component contains a dialog window which will ask the user if he is sure to delete his post and the Button which opens it.
 *
 * The only value in his state is the open key which determines if the dialog is open
 */
class DeleteQuest extends Component {
  //constructor to initialize the state of the component
  constructor() {
    super();
    this.state = {
      open: false
    };
  }
  //Opens the dialog window
  handleOpen = () => {
    this.setState({
      open: true
    });
  };
  //Closes the dialog window
  handleClose = () => {
    this.setState({
      open: false
    });
  };
  //Calls the deleteQuest action and gives it the quest id as a parameter
  //Afterwards it closes the dialog window
  deleteQuest = () => {
    this.props.deleteQuest(this.props.questId);
    this.setState({
      open: false
    });
  };

  render() {
    //Props which got loaded by the stores state
    const { classes } = this.props;

    return (
      <Fragment>
        <CustomButton
          tip="Delete"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutline color="primary" />
        </CustomButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Are you sure you want to do this, mate?</DialogTitle>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.deleteQuest} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
//PropTypes checks our required attributes and warns us if they arent properly assigned
DeleteQuest.propTypes = {
  deleteQuest: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  questId: PropTypes.string.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  deleteQuest
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(DeleteQuest));
