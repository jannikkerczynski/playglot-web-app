const { db } = require("../utilities/admin");
const { validateQuestData } = require("../utilities/validators");
/**
 * getAllQuests
 * This function gets all quests from the database.
 *
 * It orders them descending from the creation date.
 * Then we push each document into the created quests array.
 * Eventually we return a response which holds a json object with the quest array.
 */
exports.getAllQuests = (req, res) => {
  //Getting the quests from the collection
  db.collection("quests")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      //Creating the quests array
      let quests = [];
      //Cycling through the quest collections and pushing the data into the quests array
      data.forEach(doc => {
        quests.push({
          questId: doc.id,
          body: doc.data().body,
          username: doc.data().username,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          fellowCount: doc.data().fellowCount,
          userImage: doc.data().userImage,
          game: doc.data().game,
          time: doc.data().time
        });
      });
      //Returning the json holding the quests array
      return res.json(quests);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

/**
 * postOneQuest
 * This function adds a quest into the database.
 *
 * First it checks if the request body,game and time isn´t empty.
 * If it is empty it will return a res 400 code with a json which holds instructions or solutions.
 * If it isn´t emtpy it creates a quest in the database collection.
 * Afterwards it returns a json object which holds the quest, which also received his quest id as attribute.
 */
exports.postAQuest = (req, res) => {
  //Creates a object with the data
  const newQuest = {
    body: req.body.body,
    username: req.user.name,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    fellowCount: 0,
    commentCount: 0,
    game: req.body.game,
    time: req.body.time
  };

  //Deconstructs the return from the validateQuestData
  const { valid, errors } = validateQuestData(newQuest);

  //Takes the valid variable and if it is not true gives back an 400 error with the errors object holding information about the problems.
  if (!valid) return res.status(400).json(errors);
  // Adds the quest to the collection
  db.collection("quests")
    .add(newQuest)
    .then(doc => {
      const resQuest = newQuest;
      resQuest.questId = doc.id;
      // Returns the modifyed quest data
      res.json(resQuest);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

/**
 * getQuest
 * This function gets a specific quest by its id from the database and all related comments.
 *
 * First we check if the there is existing a document at the given path.
 * If there isn´t one we give back a 400 error with a json as response, which says there is no quest
 * in this directory.
 * If there is a document in this path, we put the data into the questData variable.
 * We also add the questid to our questData.
 * Then we cycle through all the comments which are related to the quest and add them as an array
 * to our questData under the key comments.
 * Eventually we return a json response with all the collected data in questData.
 */
exports.getQuest = (req, res) => {
  //Create empty questData object
  let questData = {};

  db.doc(`/quests/${req.params.questId}`)
    .get()
    .then(doc => {
      //Check if the quest is still existing
      if (!doc.exists) {
        return res
          .status(400)
          .json({ erorr: "Quest wasn´t found, but there is still hope" });
      }
      //Add the data from the specific quest to the questData object
      questData = doc.data();
      //Add the quest id too
      questData.questId = doc.id;
      //Get the related comments
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("questId", "==", req.params.questId)
        .get();
    })
    .then(data => {
      //Add the related comments to the questData object
      questData.comments = [];
      data.forEach(doc => {
        questData.comments.push(doc.data());
      });
      //Return all the collected data as a json object
      return res.json(questData);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

/**
 * commentOnQuest
 * This function adds a comment to the database which is related to a specific quest.
 *
 * First we check if the comment isn´t an empty string.
 * If it is, we return a 400 error and give instructions how to solve the problem.
 * If it is not empty, we created a newComment object, which we fill with all the data we have in our request.
 * We check if the quest is still existing in the database and if not we return a 404 error with a message.
 * If the quest is still in our database, we update the commentCount of our quest, then add the comment to our database
 * and then send a response with the newComment as a json object.
 */
exports.commentOnQuest = (req, res) => {
  //Checking if the comment isn´t a empty string
  if (req.body.body.trim() === "") {
    return res
      .status(400)
      .json({ comment: "Please enter a comment, my dear Friend" });
  }

  //Create a newComment object which holds all comment data
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    questId: req.params.questId,
    username: req.user.name,
    userImage: req.user.imageUrl
  };

  // Checking if the quest is still in the database
  db.doc(`/quests/${req.params.questId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({
          error:
            "This Quests was to dangerous we took it down for your own security."
        });
      }
      // Updating the commentCount on the quest
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      //Adding the commment to the database
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      //Returning a json object as a response containing the freshly made comment
      res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

/**
 * followQuest
 * This function creates a fellowship document when a user follows a quest.
 *
 * First we create a questData variable and assign it an empty object.
 * We then check if the fellowship related quest is existing and if not we return a 404 error.
 * If the quest is existing in our database, we return it as our promise while adding the quest id to it too.
 * Then we check if there is already a document in the fellowship collection.
 * If there is one we return a 400 error with a message.
 * If there isn´t one, we create one and increment our fellowCount.
 * Last we get the comments related to the quest and add them to our questData and then return this data as
 * json object.
 */
exports.followQuest = (req, res) => {
  //Create a variable questData and assign it an empty object
  let questData = {};
  //Get the related quest
  db.doc(`/quests/${req.params.questId}`)
    .get()
    .then(doc => {
      //Check if it exists
      if (doc.exists) {
        questData = doc.data();
        questData.questId = doc.id;
        //Promise with the fellowship collection where the username and quest id match the paramaters
        return db
          .collection("fellowship")
          .where("username", "==", req.user.name)
          .where("questId", "==", req.params.questId)
          .limit(1)
          .get();
      } else {
        return res.status(404).json({
          error:
            "This Quests seems to be out of order. We are sorry for your lost."
        });
      }
    })
    .then(data => {
      //Check if the fellowship already exists
      if (data.empty) {
        return db
          .collection("fellowship")
          .add({ questId: req.params.questId, username: req.user.name })
          .then(() => {
            //Increment the fellowCount
            questData.fellowCount++;
            //Update the fellowCount in the quest
            return db
              .doc(`/quests/${req.params.questId}`)
              .update({ fellowCount: questData.fellowCount });
          })
          .then(() => {
            //Get the comments and return as a Promise
            return db
              .collection("comments")
              .orderBy("createdAt", "desc")
              .where("questId", "==", req.params.questId)
              .get();
          })
          .then(data => {
            //Add the comments to the questData
            questData.comments = [];
            data.forEach(doc => {
              questData.comments.push(doc.data());
            });
            //Return the json object with all the quest related data
            return res.json(questData);
          });
      } else {
        return res
          .status(400)
          .json({ error: "You already declare your fellowship." });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        error: "Error when declaring your fellowship"
      });
    });
};

/**
 * unfollowQuest
 * This function works the same way as the followQuest above, just with the difference that it deletes
 * the fellowshop if it exists.
 */
exports.unfollowQuest = (req, res) => {
  let questData = {};
  db.doc(`/quests/${req.params.questId}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        questData = doc.data();
        questData.questId = doc.id;
        return db
          .collection("fellowship")
          .where("username", "==", req.user.name)
          .where("questId", "==", req.params.questId)
          .limit(1)
          .get();
      } else {
        return res.status(404).json({
          error:
            "This Quests seems to be out of order. We are sorry for your lost."
        });
      }
    })
    .then(data => {
      if (data.empty) {
        return res
          .status(400)
          .json({ error: "You didnt had any fellowship with this Quest!" });
      } else {
        return db
          .doc(`/fellowship/${data.docs[0].id}`)
          .delete()
          .then(() => {
            questData.fellowCount--;
            return db
              .doc(`/quests/${req.params.questId}`)
              .update({ fellowCount: questData.fellowCount });
          })
          .then(() => {
            return db
              .collection("comments")
              .orderBy("createdAt", "desc")
              .where("questId", "==", req.params.questId)
              .get();
          })
          .then(data => {
            questData.comments = [];
            data.forEach(doc => {
              questData.comments.push(doc.data());
            });
            res.json(questData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(400).json({
        error: "You declared your fellowship mate. Muchas Gracias"
      });
    });
};

/**
 * deleteQuest
 * This function deletes a quest from the database.
 *
 * It does so by checking if the specified quest is existing in the database.
 * If its not existing it gives back an 404 error with a message.
 * If it is existing it checks if we are the owner of the quest and if so deletes it from the database.
 * After successfully deletion it sends back a response with a message.
 */
exports.deleteQuest = (req, res) => {
  //Get the quest
  db.doc(`/quests/${req.params.questId}`)
    .get()
    .then(doc => {
      //Check if its existing in the database
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: "This Quest wasn´t found. We are sorry!" });
      }
      //Checks if we are the owner
      if (doc.data().username !== req.user.name) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return db.doc(`/quests/${req.params.questId}`).delete();
      }
    })
    .then(() => {
      //Response with message
      res.json({ message: "Quest deleted successfully" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
