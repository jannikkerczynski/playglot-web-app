//React
import React, { Component } from "react";
import PropTypes from "prop-types";
//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
//Redux
import { connect } from "react-redux";
import { submitComment } from "../redux/actions/dataActions";
//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  textField: {
    paddingRight: "10px"
  }
});

/**
 * CommentForm class component
 *
 * The state of this object saves the input of the the input field and the errors which could occure by
 * the request to the server.
 */
class CommentForm extends Component {
  constructor() {
    super();
    this.state = {
      body: "",
      errors: {}
    };
  }

  //Changes the state of the errors from the input field
  //Also resets the body if the users leaves the Form and set of a load dispatch
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.UI.errors) {
      return { errors: nextProps.UI.errors };
    }
    if (!nextProps.UI.errors && nextProps.UI.loading) {
      return { body: "" };
    }
    return null;
  }

  //Standard handle to change the inputs value
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  //Puts the comment data into a object and calls the submitComment function with the object
  //Afterwards resets the input field by setting the body state to an empty string
  handleSubmit = event => {
    event.preventDefault();
    this.props.submitComment(this.props.questId, { body: this.state.body });
    this.setState({ body: "" });
  };

  render() {
    //Props which got loaded by the stores state
    const { classes, authenticated } = this.props;
    const errors = this.state.errors;

    //Puts the build component into the commentFormMarkup variable
    //If the user is authenticated he can see the commentForm
    //If not he only gets a null returned
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ display: "flex", flexDirection: "row" }}>
        <form style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <TextField
            name="body"
            type="text"
            label="Comment on Quest"
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.textField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            onClick={this.handleSubmit}
          >
            Submit
          </Button>
        </form>
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  UI: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  questId: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired
};

//mapStateToProps assigns the choosen states to the props of the component
const mapStateToProps = state => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

//mapActionToProps assigns the choosen actions to the props of the component
const mapActionToProps = {
  submitComment
};

//connect() connects the store and the component with each other
//withStyles to use the stylesheet provided in the JSS of this component
export default connect(
  mapStateToProps,
  mapActionToProps
)(withStyles(styles)(CommentForm));
