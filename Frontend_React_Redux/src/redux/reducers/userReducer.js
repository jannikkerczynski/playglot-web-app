//Import action types
import {
  SET_USER,
  SET_UNAUTHENTICATED,
  SET_AUTHENTICATED,
  LOADING_USER,
  FOLLOW_QUEST,
  UNFOLLOW_QUEST,
  MARK_NOTIFICATIONS_READ,
  ADD_MESSAGED_USERS,
  STOP_LOADING_USER
} from "../types";

/**
 * The initial State of the user reducer. It checks in its state if the user is authenticated, saves his credentials, his fellowCount, his notifactions
 * and if any of the information is loading yet.
 */
const initialState = {
  authenticated: false,
  credentials: {},
  loadingUser: false,
  fellowCount: [],
  notifications: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    //Sets the state of authentication to true
    case SET_AUTHENTICATED:
      return {
        ...state,
        authenticated: true
      };
    //Resets all the information to the initial state, since the user is logged out.
    case SET_UNAUTHENTICATED:
      return initialState;
    //Puts the loadingUser state to true
    case LOADING_USER:
      return {
        ...state,
        loadingUser: true
      };
    //Puts the loadingUser state to true
    case STOP_LOADING_USER:
      return {
        ...state,
        loadingUser: false
      };
    //Sets the received data from the server as state
    case SET_USER:
      return {
        authenticated: true,
        ...action.payload
      };
    //Puts the fetched fellowcount and an object with the keys username and questid as the the fellowCount state
    case FOLLOW_QUEST:
      return {
        ...state,
        fellowCount: [
          ...state.fellowCount,
          {
            username: state.credentials.name,
            questId: action.payload.questId
          }
        ]
      };
    //Filters the unfollowed quest out of the fellowcount state
    case UNFOLLOW_QUEST:
      return {
        ...state,
        fellowCount: state.fellowCount.filter(
          fellow => fellow.questId !== action.payload.questId
        )
      };
    //Changes the notifications from not read to read
    case MARK_NOTIFICATIONS_READ:
      state.notifications.forEach(not => (not.read = true));
      return {
        ...state
      };
    //Adds the messaged users State to the credentials so it gets loaded on mount
    case ADD_MESSAGED_USERS:
      return {
        ...state,
        credentials: {
          ...state.credentials,
          messagedUsers: [...state.credentials.messagedUsers]
        }
      };
    default:
      return state;
  }
}
