//Import action types
import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ,
  ADD_MESSAGED_USERS,
  STOP_LOADING_USER
} from "../types";
//Import axios to make HTTP Requests
import axios from "axios";

import { getQuests } from "./dataActions";

/**
 *
 * @param {*} userData The user data which is getting send to the server to authenticate the user
 * @param {*} history To redirect the user to the path /home after successful authentifcation
 *
 * Send the given data to the Server to authenticate the user and afterwards takes the reponse token
 * and puts it into the authorization header. After that the users data gets requested through the dispatch
 * of the getUserData() function. Finally the client gets directed to the url/home path.
 */
export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/home");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

/**
 *
 * @param {*} newUserData The Data which is used to authenticate the user at the server side
 * @param {*} history Used to direct the user to the main page after authentification
 *
 * The entered Data gets send to the server and the user will be signed up with it.
 * As a response we get a token, which will be stored in the authorization header.
 * After that the logged users credentials will be loaded through the dispatch of getUserData().
 * Eventually the user gets directs to the home page.
 */
export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/home");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
/**
 * Logs the user out and removes the Token from the local storage and the authorization header.
 * After that the user gets set as unauthenticated in the reducer through the dispatch.
 */
export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

/**
 * Gets the userdata from the authenticated user of the server and then dispatches is to save it in the state.
 * Afterwards it tells the UI to stop loading by dispatching the type STOP_LOADING_UI
 */
export const getUserData = () => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .get(`/user`)
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));

  dispatch({ type: STOP_LOADING_USER });
};

/**
 *
 * @param {*} formData The file we choose to upload for our image
 *
 * First the Loading user state will be set to true by dispatching that action.
 * After that we make a post request to upload our choosen file.
 * Then we reload our data to update everything on screen. This happens throught the dispatch of
 * getUserData and getQuests.
 */
export const uploadImage = formData => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post(`user/image`, formData)
    .then(() => {
      dispatch(getUserData());
      dispatch(getQuests());
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} userDetails The entered user details which then get send to the server
 *
 * We first mark the loading user state as true.
 * Afterwards we post the user details to our server and refresh our profile with the dispatch
 * of getUserData.
 */
export const editUserDetails = userDetails => dispatch => {
  dispatch({ type: LOADING_USER });
  axios
    .post("/user", userDetails)
    .then(() => {
      dispatch(getUserData());
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} notificationIds The notifcations ids which got marked as read recently
 *
 * We make a post request to the server and five the noticationsIds as our parameter. This sets the
 * notifactions which fit to read on the server.
 */
export const markNotificationsRead = notificationIds => dispatch => {
  axios
    .post("/notifications", notificationIds)
    .then(res => {
      dispatch({
        type: MARK_NOTIFICATIONS_READ
      });
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} username The username which determines which user gets added to the list
 *
 * We wrap the username into a object to send it to our server.
 * With the response we dispatch, we update the list of added users.
 */
export const addMessagedUser = username => dispatch => {
  const addedUser = { addedUser: username };
  axios
    .post(`/addUser`, addedUser)
    .then(res => {
      dispatch({
        type: ADD_MESSAGED_USERS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} token The token from the firebase server
 *
 * We put the token from the server into the local storage and into the authorization header.
 */
const setAuthorizationHeader = token => {
  const FBIdToken = "Bearer " + token;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken;
};
