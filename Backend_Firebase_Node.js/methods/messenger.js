//Requiring the firestore from the admin.js
const { db } = require("../utilities/admin");

/**
 * sendMessage
 * This function is called for the purpose of sending a message
 * to the choosen recipient.
 * First the request body gets checked for actually value.
 * If the body only contains an empty string, we return a response with a status 400 code
 * and json object, with a request to enter a message.
 * If the body isn´t empty we will created a newMessage for the database.
 * Afterwards we will add it to the collection "messages" and return a response,
 * which contains a json with the newly added message and the Id of the document.
 */
exports.sendMessage = (req, res) => {
  //Checks if the body is empty
  if (req.body.body.trim() === "") {
    //If so it returns a status 400 code with instructions
    return res
      .status(400)
      .json({ body: "Please enter a message my dear friend." });
  }
  //Created a object which holds the message informations
  const newMessage = {
    body: req.body.body,
    sender: req.user.name,
    userImage: req.user.imageUrl,
    recipient: req.params.recipient,
    createdAt: new Date().toISOString()
  };
  // Add it to the messages collection
  db.collection("messages")
    .add(newMessage)
    .then(doc => {
      //Modify the response by adding the doc.id to the object
      const resMessage = newMessage;
      resMessage.messageId = doc.id;
      res.json(resMessage);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

/**
 * getAllMessages
 * This function is called for the purpose of getting all messages
 * between the user who calls it and the choosen recipient.
 * This works by getting the collection of messages where
 * the sender is equal to the user requesting and the given recipient and vice versa.
 * Then we push the information from those document collections into the messages array,
 * that we created in the beginning.
 * As the last action we return a response with a json object which holds the just filled messages array.
 */
exports.getAllMessages = (req, res) => {
  // Array gets created
  let messages = [];
  //Getting the messages from the user with the recipient, ordered by the creation time
  db.collection("messages")
    .orderBy("createdAt", "desc")
    .where("sender", "==", req.user.name)
    .where("recipient", "==", req.params.recipient)
    .get()
    .then(data => {
      //Pushing them into the messages Array
      data.forEach(doc => {
        messages.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          recipient: doc.data().recipient,
          sender: doc.data().sender
        });
      });
      //Getting the messages from the recipient with the user, ordered by the creation time
      return db
        .collection("messages")
        .orderBy("createdAt", "desc")
        .where("recipient", "==", req.user.name)
        .where("sender", "==", req.params.recipient)
        .get();
    })
    .then(data => {
      //Pushing them into the messages Array
      data.forEach(doc => {
        messages.push({
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          recipient: doc.data().recipient,
          sender: doc.data().sender
        });
      });
      //Return a json with contains the messages array
      return res.json(messages);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
