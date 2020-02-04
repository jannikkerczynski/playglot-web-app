//This is the Theme js which is written in JSS. It can get accessed from all componentsn as needed
export default {
  palette: {
    primary: {
      main: "#fe8b56",
      contrastText: "#fff"
    },
    secondary: {
      main: "#ffffff",
      contrastText: "#000"
    }
  },
  spreadThisCSS: {
    typography: {
      useNextVariants: true
    },
    button: {
      marginTop: 20,
      position: "relative"
    },
    customError: {
      color: "red",
      fontSize: "0.7rem",
      marginTop: 10
    },
    progress: {
      position: "absolute"
    },
    invisibleSeparator: {
      border: "none",
      margin: 4
    },
    visibleSeparator: {
      width: "100%",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      marginBottom: 20
    },
    paper: {
      padding: 20
    },

    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    },
    coolButton: {
      background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
      border: 0,
      borderRadius: 3,
      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
      color: "white",
      height: 48,
      padding: "0 30px"
    },
    coolButton1: {
      background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
      border: 0,
      borderRadius: 3,
      boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
      color: "white",
      height: 48,
      padding: "0 30px"
    }
  }
};
