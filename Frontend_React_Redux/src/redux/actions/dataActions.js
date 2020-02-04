//Import action types
import {
  SET_QUESTS,
  LOADING_DATA,
  FOLLOW_QUEST,
  UNFOLLOW_QUEST,
  DELETE_QUEST,
  SET_ERRORS,
  CLEAR_ERRORS,
  POST_QUEST,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_QUEST,
  SUBMIT_COMMMENT,
  SET_MESSAGES,
  SEND_MESSAGE,
  SET_FILTER,
  SET_USERS,
  SET_ADDRESSED
} from "../types";

//Axios import to make HTTP Requests to our server
import axios from "axios";

/**
 * We get all the Quests on the Server with this function.
 * We do that by fist setting the loading data key of the reducer to true.
 * After that we make a get request to the server and we dispatch the answer to the reducer.
 */
export const getQuests = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/quest")
    .then(res => {
      dispatch({
        type: SET_QUESTS,
        payload: res.data
      });
    })
    .catch(_err => {
      dispatch({
        type: SET_QUESTS,
        payload: []
      });
    });
};

/**
 *
 * @param {*} newPost The Post that will be written into the database
 *
 * We first set off the loading state so its true. Afterwards we send the post request containing the
 * new made quest. The response, which cointains the fresh quest will be dispatched to the reducer.
 * Lastly all errors which could have occured will be cleared so the input field will be clean.
 */
export const postQuest = newQuest => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/quest", newQuest)
    .then(res => {
      dispatch({
        type: POST_QUEST,
        payload: res.data
      });
      dispatch(clearErrors());
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
 * @param {*} questId  used to identify the right document in the collection of the quests on the server
 * @param {*} commentData used to create a comment document on the server
 *
 * We send the comment data to the document directory which the quest id points to.
 * After that we use the reponse which includes the newly made comment to update our data in the reducer.
 */
export const submitComment = (questId, commentData) => dispatch => {
  axios
    .post(`/quest/${questId}/comment`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
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
 * @param {*} questId specifies the path to the document of the quests collection
 *
 * We send a get request to the server and dispatch the followship that we get as a response.
 */
export const followQuest = questId => dispatch => {
  axios
    .get(`/quest/${questId}/follow`)
    .then(res => {
      dispatch({
        type: FOLLOW_QUEST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} questId specifies the path to the document of the quests collection
 *
 * We send a get request to the server and dispatch the canceled followship that we get as a response.
 */
export const unfollowQuest = questId => dispatch => {
  axios
    .get(`/quest/${questId}/unfollow`)
    .then(res => {
      dispatch({
        type: UNFOLLOW_QUEST,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} questId specifies the path to the document of the quests collection
 *
 * We send a delete request with the specified quest id to the server. After the Quest got deleted,
 * we dispatch the quest id to the reducer to remove it from the state.
 */
export const deleteQuest = questId => dispatch => {
  axios
    .delete(`/quest/${questId}`)
    .then(() => {
      dispatch({ type: DELETE_QUEST, payload: questId });
    })
    .catch(err => console.log(err));
};

/**
 * Clears the Erros in the state with a Dispatch
 */
export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};

/**
 *
 * @param {*} questId specifies the path to the document of the quests collection
 *
 * Loads a specific quest through the get request with the quest id pointing to a certain document in the collection.
 * The answer which holds the quest gets afterwards dispatched to the reducer and put into the state.
 */
export const getQuest = questId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/quest/${questId}`)
    .then(res => {
      dispatch({
        type: SET_QUEST,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};

/**
 *
 * @param {*} username specifies the path to the document of the user collection
 *
 * Receives data from the get request which then gets dispatched to the reducer to set the Quests of the user in the state.
 */
export const getUserData = username => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${username}`)
    .then(res => {
      dispatch({
        type: SET_QUESTS,
        payload: res.data.quests
      });
    })
    .catch(() => {
      dispatch({
        type: SET_ERRORS,
        payload: null
      });
    });
};

/**
 *
 * @param {*} recipient specifies the path to the document of the user collection
 *
 * We send a get request to the server to get all the messages between the given recipient
 * and the logged user. After we receive them, we dispatch them to the reducer to put them in the state.
 */
export const getMessages = recipient => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/messages/${recipient}`)
    .then(res => {
      dispatch({
        type: SET_MESSAGES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_MESSAGES,
        payload: []
      });
    });
};

/**
 *
 * @param {*} userMessage The message which should get sended
 * @param {*} recipient specifies the path to the document of the user collection
 *
 * With the recipient as a pointer we send a post request to our server. We use the userMessage as a
 * parameter to write a message doc. We afterwards receive the written doc as an answer back from the Server.
 * We dispatch it to put the messages in the state and clear our errors afterwards.
 */
export const sendMessage = (userMessage, recipient) => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/messages/${recipient}`, userMessage)
    .then(res => {
      dispatch({
        type: SEND_MESSAGE,
        payload: res.data
      });
      dispatch(clearErrors());
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
 * @param {*} username The user we are chatting with right now
 *
 * We dispatch the given username to open the chat window with that person
 */
export const setAddressed = username => dispatch => {
  dispatch({ type: SET_ADDRESSED, payload: username });
};

/**
 *
 * @param {*} filter the words after which we filter post and users
 *
 * We dispatch the filter value to the reducer to update the filter state.
 */
export const setFilter = filter => dispatch => {
  dispatch({
    type: SET_FILTER,
    payload: filter
  });
};

/**
 * We send a get request to receive all users as a response.
 * After we get those Users we disptach them to the reducer which puts them into our state.
 */
export const getAllUsers = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/users")
    .then(res => {
      dispatch({
        type: SET_USERS,
        payload: res.data
      });
    })
    .catch(_err => {
      dispatch({
        type: SET_USERS,
        payload: []
      });
    });
};
