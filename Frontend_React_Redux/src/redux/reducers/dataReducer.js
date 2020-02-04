//Import action types
import {
  SET_QUESTS,
  LOADING_DATA,
  FOLLOW_QUEST,
  UNFOLLOW_QUEST,
  DELETE_QUEST,
  POST_QUEST,
  SET_QUEST,
  SUBMIT_COMMMENT,
  SET_MESSAGES,
  SEND_MESSAGE,
  SET_FILTER,
  SET_USERS,
  SET_ADDRESSED
} from "../types";

/**
 * The initial State of the Data Reducer
 *
 * Its there to save all quests, on specific quest, messages of the user and a recipient,
 * a loading parameter, the filter value for the the input field, the users for the displaying profiles
 * and the addressed value for messaging
 */
const initialState = {
  quests: [],
  quest: {},
  messages: [],
  loadingData: false,
  filter: "",
  users: [],
  addressed: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    // Indicates that data is being loaded
    case LOADING_DATA:
      return { ...state, loadingData: true };
    // Loads the received quests into the quest State and sets the loading to a finished state
    case SET_QUESTS:
      return { ...state, quests: action.payload, loadingData: false };
    // Puts a spefic requested quest into the quest state
    case SET_QUEST:
      return {
        ...state,
        quest: action.payload
      };
    // Puts the requested messages into the messages array and finishes the loading sequence
    case SET_MESSAGES:
      return { ...state, messages: action.payload, loadingData: false };
    // Updates the state with the already existing and newly send Message
    case SEND_MESSAGE:
      return {
        ...state,
        messages: [action.payload, ...state.messages]
      };
    // Updates the state of the quest on the matching questId in the quests state and the single quest state
    case FOLLOW_QUEST:
    case UNFOLLOW_QUEST:
      let index = state.quests.findIndex(
        quest => quest.questId === action.payload.questId
      );
      // Sets the quest with the fitting Id in the quests state
      state.quests[index] = action.payload;
      // Sets the specific quest state equal the quest from the answer
      if (state.quest.questId === action.payload.questId) {
        state.quest = action.payload;
      }
      return {
        ...state
      };
    // Deletes the quest which got deleted in the state
    case DELETE_QUEST: {
      let index = state.quests.findIndex(
        quest => quest.questId === action.payload
      );
      let mutatedQuests = state.quests;
      //Removes the Quest from the array at the index which got determined with the quest id
      mutatedQuests.splice(index, 1);
      //Gives the the mutated quests back to the quests state
      return {
        ...state,
        quests: mutatedQuests
      };
    }
    // Gives the posted quest with all previous quests back to the state
    case POST_QUEST:
      return {
        ...state,
        quests: [action.payload, ...state.quests]
      };
    //Gives the whole previous state back to the quest state and adds the newly added comments
    case SUBMIT_COMMMENT:
      return {
        ...state,
        quest: {
          ...state.quest,
          comments: [action.payload, ...state.quest.comments]
        }
      };
    //Updates the filter state
    case SET_FILTER:
      return { ...state, filter: action.payload };
    //Updates the user state with the requested users from the server and sets the loadingdata to false
    case SET_USERS:
      return { ...state, users: action.payload, loadingData: false };
    //Updates the addressed user for the messenger function
    case SET_ADDRESSED:
      return { ...state, addressed: action.payload };
    default:
      return state;
  }
}
