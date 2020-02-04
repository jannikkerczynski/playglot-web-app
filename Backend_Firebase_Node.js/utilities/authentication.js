//

//import admin and db from the the admin.js
const { admin, db } = require("./admin");

/**
 * fbAuth
 * Middleware for checking if the token is valid and assigning extra information to the request if it is
 *
 * We create a idToken variable. Then we check if the headers have an authorization and if it starts with Bearer
 * If it does the split the authorization headers to be left over with the token which, is then assigned to the idToken variable.
 * If we dont have a authorization header we return a 403 error.
 *
 * Afterwards we use that token to verify it with the given firebase function. After the token gets verified we use the promise
 * to get the collection of the verifyied user which we use as a promise object return.
 * We then assign the data we get from it to the request itself so we can always use it later on.
 */
module.exports = (req, res, next) => {
  //Create idToken variable
  let idToken;
  //Check if the have a headers.authorization and if it begins with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    //assign the token to idToken
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    //Return an error in case its not found
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized Access" });
  }
  //Verify the token we just extracted
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      //Assign it to the request to use it later
      req.user = decodedToken;
      //Get the user collection of the verified user
      return db
        .collection("user")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      //Assign the name and the imageUrl for later user to the request
      req.user.name = data.docs[0].data().name;
      req.user.imageUrl = data.docs[0].data().imageUrl;
      return next();
    })
    .catch(err => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
};
