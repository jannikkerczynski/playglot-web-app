//Imports the firebase-admin and the firestore database (db)
const { admin, db } = require("../utilities/admin");
//Imports the firebase config data from the config.js
const config = require("../utilities/config");
//Imports the firebase for authentication
const firebase = require("firebase");
//Imports utilities to validate and check data
const {
  validateSignupData,
  validateLoginData,
  reduceUserDetails
} = require("../utilities/validators");
//Initializes the firebase App with the given config data
firebase.initializeApp(config);

/**
 * signup
 * This function is used to signup to the the web application.
 *
 * First we create a newUser variable which contains the data of the request.
 * After that we validate the signup data and if we encounter any errors we return
 * them with a 400 error.
 * If the data is valid we create a user document with the id of the username,
 * but only if the username isn´t taken already. Otherwise we give back a 400 error with a message.
 * If the username isn´t taken we create the account by returning the firebase functions
 * auth().createUserWithEmailAndPassword() as a promise.
 * With this promise we can access the user id of the user and add it to our database.
 * After that we return the id token for our user, which we then use to store in the token variable.
 * We also store the collected userCredentials in the same called object variable and add it to the database.
 * The last step is to return the token as a json object in the response.
 * We also define solutions for the different errors in the catch block
 */
exports.signup = (req, res) => {
  //Create variables to hold the token and the user id
  let userId, token;
  //Create a varriable object with the user informations
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    name: req.body.name
  };
  //Deconstruct valid and errors from the validation function
  const { valid, errors } = validateSignupData(newUser);

  //Based on the validation this will return a 400 error with all the errors
  if (!valid) return res.status(400).json(errors);

  //Checks if the Username already exists.
  db.doc(`/user/${newUser.name}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        //If it exists returns a 400 error
        return res
          .status(400)
          .json({ name: "Sorry, this Username is already taken" });
      } else {
        //If it exists register the user through the firebase methods provided for this
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      //The data from the promise is used to set the userId to store it for adding it to the credentials
      userId = data.user.uid;
      //Returns a token for the signed up user
      return data.user.getIdToken();
    })
    .then(userToken => {
      //Assigns the just returned userToken to the token variable
      token = userToken;
      //Adds all the credentials in one object
      const userCredentials = {
        userId,
        name: newUser.name,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/playglot.appspot.com/o/unknownAvatar.png?alt=media&token=de85c332-bf75-42da-9c09-db5121625ba4`,
        likes: "",
        plays: "",
        speaks: "",
        learns: "",
        location: "",
        messagedUsers: []
      };
      //Adds the userCredentials to the collection of users
      return db.doc(`/user/${newUser.name}`).set(userCredentials);
    })
    .then(() => {
      //Returns the token to store it in the browser
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      //If the E-Mail is already used give instructions
      if (err.code === `auth/email-already-in-use`) {
        return res.status(400).json({ email: "E-Mail is already in use" });
      } else {
        return res.status(500).json({
          general: "Something went wrong, please try again my friend"
        });
      }
    });
};

/**
 * login
 * This function helps the user to log into the application.
 *
 * First we save the user data from the request into the user object variable.
 * Then we validate it through our written validate method, from the utilities folder.
 * If the validation fails we give back the errors with a 400 error code.
 * If the validation succeeds we authenticate our user and get a token for him.
 * Finally we return the token as a json object in the response.
 */
exports.login = (req, res) => {
  //Create user variable and store the request body in it
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  //Deconstruct the validateLoginData function to get the validation and the errors
  const { valid, errors } = validateLoginData(user);
  //If the validation is false it will return a 400 error with the errors as a message
  if (!valid) return res.status(400).json(errors);
  //Logs the user in
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      //Returns the token for the user
      return data.user.getIdToken();
    })
    .then(token => {
      //returns the token as a response in a json object
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      //If the err.code equals one of those two strings it will respond with a 403 error and a message for instructions
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-user"
      ) {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else return res.status(500).json({ error: err.code });
    });
};

/**
 * uploadProfileImage
 *
 * This function takes a file and uploads it to the cloud storage.
 *
 * We first get the imports we need. They include BusBoy a parser fpr html formdata.
 * We use it to extract datainformation from the file that we get in the request.
 * We validate if the file is a jpeg or a png. If it isnt we give back a 400 error.
 * If the mimetype fits we continue with splitting the name so we are left with the type only.
 * We create a new filename for the storage, which consists of a random number and the type we just
 * extracted. Its important since the storage of firebase overwrites a file if it has the same name.
 * We then define the filepath and atatch the writeable stream to the readable stream.
 * Finally we upload the image to our storage and add some options like making it not reumable and giving it
 * the mimetype in the metadata. We then update the url data on the databank for the path.
 */
exports.uploadProfileImage = (req, res) => {
  //Imports for the file extraction and edits
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  //new busboy object which takes the headers as constructor parameter
  const busboy = new BusBoy({ headers: req.headers });
  //variables to hold the name and the object for the upload
  let imageFileName;
  let imageToBeUploaded = {};

  //reads the file and returns different values for usage
  busboy.on("file", (_fieldname, file, filename, _encoding, mimetype) => {
    //Checks if the file is a jpeg or png
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    //gets the exenstion of the file e.g. png or jpeg
    const imageExtension = filename.split(".").pop();
    //creats a random name
    imageFileName = `${Math.round(
      Math.random() * 1234567890
    )}.${imageExtension}`;
    //Join the path of the os with the created filename
    const filepath = path.join(os.tmpdir(), imageFileName);
    //Object for the upload
    imageToBeUploaded = { filepath, mimetype };
    //We attach the writeable stream of filepath to the readable stream pipe
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    //Upload the file to the storage
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        //If the upload gets disrupted it cant resume and the upload needs to be done again
        resumable: false,
        metadata: {
          //gives the mimetype as metadata information
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(data => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/user/${req.user.name}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "Profile uploaded successfully" });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

/**
 * addUserDetails
 * This function is used to add details to the profile.
 *
 * It assigns the request body to a variable which afterwards updates the user
 * information in the database. Afterwards it returns a json message which confirms the successful adding.
 */
exports.addUserDetails = (req, res) => {
  //Assigns the request body to the userDetails variable
  let userDetails = reduceUserDetails(req.body);
  // Adds the detials to the user with a certain username
  db.doc(`/user/${req.user.name}`)
    .update(userDetails)
    .then(() => {
      //Returns a message with confirmation
      return res.json({ message: "Details got added" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/**
 * addUsertoMessengerList
 * This function adds a user to his messenger list and does the same for the recipient(adding the requesting user to his list).
 *
 * It first updates the requesting users messenger list and afterwards the list of the recipient.
 * Lastly it returns the addedUser as a json response.
 */
exports.addUsertoMessengerList = (req, res) => {
  //Updates the users messenger list
  db.doc(`/user/${req.user.name}`)
    .update({
      messagedUsers: admin.firestore.FieldValue.arrayUnion(req.body.addedUser)
    })
    .then(() => {
      //Updates the recipients messenger list
      db.doc(`/user/${req.body.addedUser}`).update({
        messagedUsers: admin.firestore.FieldValue.arrayUnion(req.user.name)
      });
    })
    .then(() => {
      //Returns the addedUser as a json object
      return res.json({ userAdded: req.body.addedUser });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/**
 * removeUsertoMessengerList
 * This function removes a user from the messenger list.
 *
 * It works in the same way the addUserToMessengerList does, besides it only removes the choosen user from your list and returns
 * a confirmation text as a json
 */
exports.removeUserfromMessengerList = (req, res) => {
  //Deletes the user from the messenger list
  db.doc(`/user/${req.user.name}`)
    .update({
      messagedUsers: admin.firestore.FieldValue.arrayRemove(req.body.addedUser)
    })
    .then(_data => {
      //Returns the confirmation as json object
      return res.json({ message: "Removal was succesfull my friend" });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/**
 * getAuthUser
 * This function gets information about the user which is authenticated.
 *
 * We create a userData variable, which we assign to an empty object.
 * Then we check if the user is already existing in the database. If so
 * we assign the data from the document to our userData variable and return the fellowship collection
 * of our user. We then use it and cycle through the collection to get all assigned fellowships associated with our user.
 * Afterwards we return the notification collection as a promise.
 * We use it aferwards to cycle through it and get all the notifications associated with our user and add their informations
 * to the userData.
 * Eventually we return the userData variable with all assigned data as a json response.
 */
exports.getAuthUser = (req, res) => {
  //Create userData variable and assign it an empty object
  let userData = {};
  //Get the specified user and save the credentials in the userData variable
  db.doc(`/user/${req.user.name}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        userData.credentials = doc.data();
        //Return the fellowship as a promise object
        return db
          .collection(`fellowship`)
          .where("username", "==", req.user.name)
          .get();
      }
    })
    .then(data => {
      //Create a fellowCount key and assing a empty array to it
      userData.fellowCount = [];
      //Cycle through the fellowship data and push the infomation into the created array
      data.forEach(doc => {
        userData.fellowCount.push(doc.data());
      });
      //Return a promise object which contains the notifications of the user
      return db
        .collection("notifications")
        .where("recipient", "==", req.user.name)
        .orderBy("createdAt", "desc")
        .limit(10)
        .get();
    })
    .then(data => {
      //Create a notifications key and assing a empty array to it
      userData.notifications = [];
      //Cycle through the notifications collection and push all the information to the array
      data.forEach(doc => {
        userData.notifications.push({
          recipient: doc.data().recipient,
          sender: doc.data().sender,
          read: doc.data().read,
          questId: doc.data().questId,
          type: doc.data().type,
          createdAT: doc.data().createdAt,
          notificationId: doc.id
        });
      });
      //Return all the data as a json response
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/**
 * getUserDetails
 * This function gets all the information of a specific user.
 *
 * First we create a userData variable and assign it to an empty object. Then we get the choosen user collection,
 * check if it exists and if so assign the data to the variable userData and return the collection of the users quests.
 * if the user collection doesnt exist, we return a 404 error with a json error message.
 * We then push the user quests into the userData variable as an array.
 * Lastly we return all the data as a response in a json object.
 */
exports.getUserDetails = (req, res) => {
  //Create userData variable and assing an empty object to it
  let userData = {};
  //Get the user collection

  db.doc(`/user/${req.params.name}`)
    .get()
    .then(doc => {
      //If it exists assign the data to the userData variable
      if (doc.exists) {
        userData.user = doc.data();
        //Return the quests of the user as a promise object

        return db
          .collection("quests")
          .where("username", "==", req.params.name)
          .orderBy("createdAt", "desc")
          .get();
      } else {
        //If it doesnt exist return a 404 error with a message
        return res
          .status(404)
          .json({ errror: "This User doesn´t seem to exist. We are sorry." });
      }
    })
    .then(data => {
      //Create a key and assign a empty array to it
      userData.quests = [];

      //Cycle through the  quests and push the data into the created array
      data.forEach(doc => {
        userData.quests.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          username: doc.data().username,
          userImage: doc.data().userImage,
          fellowCount: doc.data().fellowCount,
          likes: doc.data().likes,
          commentCount: doc.data().commentCount,
          game: doc.data().game,
          time: doc.data().time,
          questId: doc.id
        });
      });
      //Return all the data collected as json response
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/**
 * markNotificationsAsRead
 * This function marks the notfications we saw already as read.
 *
 * First we create a batch. Then we cycle through the request body which contains the notifications id of our user.
 * With each cycle we get the specific notification and save it in a variable and then add it to the batch and update the read key to true.
 * Afterwards we commit the batch and send a response json which confirms the success.
 */
exports.markNotificationsAsRead = (req, res) => {
  //Create batch variable and assign it a firestore batch()
  let batch = db.batch();
  //Cycle through the notifcation ids and mark the as read through the batch update
  req.body.forEach(notifId => {
    const notification = db.doc(`/notifications/${notifId}`);
    batch.update(notification, { read: true });
  });
  //Commit the batch
  batch
    .commit()
    .then(() => {
      //Confirmation json response
      return res.json({
        message: "Notifications marked as read"
      });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

/**
 * getAllUsers
 * This function gets almost all user information.
 *
 * We get the user collections and cycle through it while assigning all the data to a array which we assing to a variable users.
 * After everything is done we send this users variable as a json response back.
 */
exports.getAllUsers = (_req, res) => {
  //Get all the users from the collection user
  db.collection("user")
    .get()
    .then(user => {
      //Create users variable which will contain all the users in an array
      let users = [];
      //Cycle through the collection and push the data to the array
      user.forEach(doc => {
        users.push({
          name: doc.data().name,
          likes: doc.data().likes,
          plays: doc.data().plays,
          learns: doc.data().learns,
          speaks: doc.data().speaks,
          location: doc.data().location,
          imageUrl: doc.data().imageUrl
        });
      });
      //Return the users array as a json response
      return res.json(users);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
