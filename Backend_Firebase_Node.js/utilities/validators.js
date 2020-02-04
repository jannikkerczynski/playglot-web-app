//Expression to validate if a string is a email address
const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};
//Checks if a string is empty
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};
//Validates the Sign Up Data for various specifications
exports.validateSignupData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = "Please enter a E-Mail address";
  } else if (!isEmail(data.email)) {
    errors.email = "Please enter a valid E-Mail address";
  }

  if (isEmpty(data.password)) errors.password = "Please enter a Password";
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = "Password must match";
  if (isEmpty(data.name)) errors.name = "Please enter a Username";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
//Validates the Login Data for various specifications
exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Please enter an Email";
  if (isEmpty(data.password)) errors.password = "Please enter a password";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
//Validates the Quest Data for various specifications
exports.validateQuestData = data => {
  let errors = {};

  if (isEmpty(data.body)) errors.body = "Please enter a description";
  if (isEmpty(data.game)) errors.game = "Please enter a game";
  if (isEmpty(data.time)) errors.time = "Please enter a time";

  return { errors, valid: Object.keys(errors).length === 0 ? true : false };
};

//Cuts the white space out of the details
exports.reduceUserDetails = data => {
  let userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.speaks.trim())) userDetails.speaks = data.speaks;
  if (!isEmpty(data.learns.trim())) userDetails.learns = data.learns;
  if (!isEmpty(data.likes.trim())) userDetails.likes = data.likes;
  if (!isEmpty(data.plays.trim())) userDetails.plays = data.plays;
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};
