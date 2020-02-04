//React
import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

//Utilties imports
import dayjs from "dayjs";

//JSS
const styles = theme => ({
  ...theme.spreadThisCSS,
  commentImage: {
    maxWidth: "100%",
    height: 100,
    objectFit: "cover",
    borderRadius: "20px"
  },
  commentData: {
    marginLeft: 20
  },
  textcomment: {
    marginTop: "10px"
  }
});

/**
 * Comments class component
 * Renders the comments of a quest while its dialogwindow is opened.
 * It gets the comments data from the global state and created small comment components for each comment in the
 * global state of comments
 */
class Comments extends Component {
  render() {
    const { comments, classes } = this.props;
    return (
      <Grid container>
        {comments.map((comment, index) => {
          const { body, createdAt, userImage, username } = comment;
          return (
            <Fragment key={createdAt}>
              <Grid item sm={12}>
                <Grid container>
                  <Grid
                    item
                    sm={3}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <img
                      src={userImage}
                      alt="Profile"
                      className={classes.commentImage}
                    />
                  </Grid>
                  <Grid item sm={9}>
                    <Typography
                      variant="h5"
                      component={Link}
                      to={`/user/${username}`}
                      color="primary"
                    >
                      {username}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
                    </Typography>
                    <Typography variant="body1" className={classes.textcomment}>
                      {body}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Fragment>
          );
        })}
      </Grid>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
Comments.propTypes = {
  comments: PropTypes.array.isRequired
};

//withStyles to use the stylesheet provided in the JSS of this component
export default withStyles(styles)(Comments);
