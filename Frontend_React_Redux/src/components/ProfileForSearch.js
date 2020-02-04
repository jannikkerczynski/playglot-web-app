//React
import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

//JSS
const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: "150px",
    minHeight: "150px"
  },
  content: {
    display: "flex",
    flexDirection: "column",
    padding: 25
  },
  timeAndGame: {
    marginBottom: "10px"
  },
  detailsText: {
    margin: "0 0 0px 0"
  },
  headerText: {
    margin: "0 0 0px 0"
  }
};

/**
 * ProfileForSearch class component
 *
 * This component is a simple displayed version of once Profile.
 * It only contains the picture, the name, and some details about the person.
 * It gets mapped through the global state of users derives its values from it.
 */
class ProfileForSearch extends Component {
  render() {
    //Props which got loaded by the stores state
    const {
      classes,
      user: { name, learns, speaks, plays, imageUrl }
    } = this.props;
    //Renders a user Profil for each user in the global state
    return (
      <Card className={classes.card}>
        <CardMedia image={imageUrl} title="Profile" className={classes.image} />
        <CardContent className={classes.content}>
          <Typography
            variant="h6"
            component={Link}
            to={`/user/${name}`}
            color="primary"
            display="block"
          >
            {" "}
            {name}
          </Typography>
          {learns && (
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.headerText}
              >
                {" "}
                learns:{" "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.detailsText}
              >
                {learns}
              </Typography>
            </div>
          )}
          {speaks && (
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.headerText}
              >
                {" "}
                speaks:{" "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.detailsText}
              >
                {speaks}
              </Typography>
            </div>
          )}
          {plays && (
            <div>
              <Typography
                variant="body2"
                display="inline"
                className={classes.headerText}
              >
                {" "}
                plays:{" "}
              </Typography>
              <Typography
                variant="body2"
                display="inline"
                className={classes.detailsText}
              >
                {plays}
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}

//PropTypes checks our required attributes and warns us if they arent properly assigned
ProfileForSearch.propTypes = {
  classes: PropTypes.object.isRequired
};

//withStyles to use the stylesheet provided in the JSS of this component
export default withStyles(styles)(ProfileForSearch);
