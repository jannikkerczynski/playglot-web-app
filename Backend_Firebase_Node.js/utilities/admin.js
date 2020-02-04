//Import the firebase-admin
const admin = require("firebase-admin");
//Initialize the App
admin.initializeApp();
//Assing the firestore to the variable db
const db = admin.firestore();
//Make admin and db export ready
module.exports = { admin, db };
