/*
 * To keep the Types like this makes it easier to find bugs since the variables will get imported
 * and we can use them in the actions and reducers as variables, that way we know we spell them correct.
 */

//User reducer types
export const MARK_NOTIFICATIONS_READ = "MARK_NOTIFICATIONS_READ";
export const SET_AUTHENTICATED = "SET_AUTHENTICATED";
export const SET_UNAUTHENTICATED = "SET_UNAUTHENTICATED";
export const SET_USER = "SET_USER";
export const LOADING_USER = "LOADING_USER";
export const STOP_LOADING_USER = "STOP_LOADING_USER";
export const ADD_MESSAGED_USERS = "ADD_MESSAGED_USERS";

//Ui reducer types

export const SET_ERRORS = "SET_ERRORS";
export const LOADING_UI = "LOADING_UI";
export const CLEAR_ERRORS = "CLEAR_ERRORS";
export const LOADING_DATA = "LOADING_DATA";
export const STOP_LOADING_UI = "STOP_LOADING_UI";

//Data reducer types
export const SET_QUESTS = "SET_QUESTS";
export const SET_QUEST = "SET_QUEST";
export const FOLLOW_QUEST = "FOLLOW_QUEST";
export const UNFOLLOW_QUEST = "UNFOLLOW_QUEST";
export const DELETE_QUEST = "DELETE_QUEST";
export const POST_QUEST = "POST_QUEST";
export const SET_MESSAGES = "SET_MESSAGES";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const SUBMIT_COMMMENT = "SUBMIT_COMMMENT";
export const SET_FILTER = "SET_FILTER";
export const SET_USERS = "SET_USERS";
export const SET_ADDRESSED = "SET_ADDRESSED";
