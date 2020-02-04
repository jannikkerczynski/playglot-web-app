/**
 * Firebase API routes for
 *    Quests, Users, Messenger
 * Firebase Functions for
 *    Notification Handling, Profile Image Update
 */

// Include the module for firebase functions
const functions = require("firebase-functions");
// Include the module for express and calling it in the same line
const app = require("express")();
const cors = require("cors");
app.use(cors());
// Include the firestore to access the database (db)
const { db } = require("./utilities/admin");
// Include the Authentification Middleware
const authentication = require("./utilities/authentication");
// Include the functions for the messenger routes
const { getAllMessages, sendMessage } = require("./methods/messenger");
// Include the functions for the quest routes
const {
  getAllQuests,
  getQuest,
  postAQuest,
  commentOnQuest,
  followQuest,
  unfollowQuest,
  deleteQuest
} = require("./methods/quests");
// Include the functions for the user routes
const {
  signup,
  login,
  addUserDetails,
  getAuthUser,
  uploadProfileImage,
  getUserDetails,
  markNotificationsAsRead,
  getAllUsers,
  addUsertoMessengerList,
  removeUserfromMessengerList
} = require("./methods/users");

// Users Routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", authentication, uploadProfileImage);
app.post("/user", authentication, addUserDetails);
app.get("/user", authentication, getAuthUser);
app.get("/user/:name", getUserDetails);
app.get("/users", getAllUsers);
app.post("/addUser", authentication, addUsertoMessengerList);
app.delete("/removeUser", authentication, removeUserfromMessengerList);
app.post("/notifications", markNotificationsAsRead);

// Quest Routes
app.get("/quest", getAllQuests);
app.post("/quest", authentication, postAQuest);
app.get("/quest/:questId", getQuest);
app.delete("/quest/:questId", authentication, deleteQuest);
app.get("/quest/:questId/follow", authentication, followQuest);
app.get("/quest/:questId/unfollow", authentication, unfollowQuest);
app.post("/quest/:questId/comment", authentication, commentOnQuest);

//Messanger Routes
app.get("/messages/:recipient", authentication, getAllMessages);
app.post("/messages/:recipient", authentication, sendMessage);

/**
 * createNotificationOnLike
 * The function triggers when a fellowship in assigned.
 * After that it checks, through the snapshot document, if the quest
 * still exists in the database and if it wasn´t your own quest that you may
 * assigned your fellowship to.
 * If those two conditions are true, a notification document will be created
 * in the database.
 */
exports.createNotificationOnFollow = functions
  .region("europe-west1")
  .firestore.document("fellowship/{id}")
  .onCreate(snapshot => {
    //Snapshot of the document
    return db
      .doc(`/quests/${snapshot.data().questId}`)
      .get()
      .then(doc => {
        //Condition
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          //Creation
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "fellowship",
            read: false,
            questId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

/**
 * deleteNotificationOnUnlike
 * The function triggers when a fellowship in canceled.
 * In this case it gets a snapshot of the document,
 * which is then uset to find the connected notification and delete it.
 */
exports.deleteNotificationOnUnfollow = functions
  .region("europe-west1")
  .firestore.document("fellowship/{id}")
  .onDelete(snapshot => {
    //Snapshot
    return (
      db
        .doc(`/notifications/${snapshot.id}`)
        //Deletion of the notification with the assigned ID value
        .delete()
        .catch(err => {
          console.error(err);
          return;
        })
    );
  });

/**
 * createNotificationOnComment
 * The function triggers when a quest got commented.
 * After that it gets a document snapshot and checks if the
 * commented quest still exists in the database and if it wasn´t
 * your own quest you commented on.
 * If those two conditions are true, a notification document will be created
 * in the database.
 */
exports.createNotificationOnComment = functions
  .region("europe-west1")
  .firestore.document("comments/{id}")
  .onCreate(snapshot => {
    //Snapshot of the document
    return db
      .doc(`/quests/${snapshot.data().questId}`)
      .get()
      .then(doc => {
        //Conditions
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          //Creation
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username,
            sender: snapshot.data().username,
            type: "comment",
            read: false,
            questId: doc.id
          });
        }
      })
      .catch(err => {
        console.error(err);
        return;
      });
  });

/**
 * onUserImageUpdate
 * The function triggers when a user updates their profile picture.
 * Then it checks if the image url is not the same as before.
 * If it isn´t we create a variable batch which holds firestore batch() call.
 * Afterwards we get the quest collection, where the username is equal
 * to the username of the user who changed his profile picture.
 * We then cycle through the returened data and call batch.update(), with the new image url,
 * on every quest.
 * The last action is to return the now filled batch with the call of batch.commit()
 */
exports.onUserImageUpdate = functions
  .region("europe-west1")
  .firestore.document("/user/{userId}")
  .onUpdate(change => {
    //Condition
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      //Creation of batch from firestore().batch()
      let batch = db.batch();
      return db
        .collection("quests")
        .where("username", "==", change.before.data().name)
        .get()
        .then(data => {
          //Going through the collection of quest which are from the user
          data.forEach(doc => {
            const quest = db.doc(`/quests/${doc.id}`);
            //Updating the image url of the user profile in the batch
            batch.update(quest, { userImage: change.after.data().imageUrl });
          });
          //Returning the commited batch
          return batch.commit();
        });
    } else {
      //Only triggers if the image url is the same - Returns true which wouldn´t change anything.
      return true;
    }
  });

/**
 * onQuestDelete
 * This function triggers if a quest gets deleted.
 * We create two variables. One for our quests ID and the other for our batch.
 * Then we eventually cycle through all the other documents related to the quest (comments, fellowship, notifications)
 * and delete the related documents. In each section we update the batch and return the commited batch
 * in the return statement.
 */
exports.onQuestDelete = functions
  .region("europe-west1")
  .firestore.document("/quests/{questId}")
  //Triggers on delete of a quest
  .onDelete((_snapshot, context) => {
    //Create the variables
    const questId = context.params.questId;
    const batch = db.batch();

    //Delete the comments related to the deleted quest

    //Return a Promise with the collection of comments
    return (
      db
        .collection("comments")
        .where("questId", "==", questId)
        .get()
        .then(data => {
          data.forEach(doc => {
            batch.delete(db.doc(`/comments/${doc.id}`));
          });
          //Return a Promise with the collection of fellowship
          return db
            .collection("fellowship")
            .where("questId", "==", questId)
            .get();
        })
        //Delete the fellowships related to the deleted quest
        .then(data => {
          data.forEach(doc => {
            batch.delete(db.doc(`/fellowship/${doc.id}`));
          });
          //Return a Promise with the collection of notifications
          return db
            .collection("notifications")
            .where("questId", "==", questId)
            .get();
        })
        //Delete the notifications related to the deleted quest
        .then(data => {
          data.forEach(doc => {
            batch.delete(db.doc(`/notifications/${doc.id}`));
          });
          //Return the commmited batch.
          return batch.commit();
        })
        .catch(err => {
          console.log(err);
        })
    );
  });

// Export for our coded Firebase API
exports.api = functions.region("europe-west1").https.onRequest(app);
