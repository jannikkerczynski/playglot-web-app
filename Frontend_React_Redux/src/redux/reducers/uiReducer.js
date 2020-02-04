//Imported action types
import {
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI
} from "../types";

//The initial State of the Ui Reducer which cointainer the loading key, which is for setting the Ui into a
//loading form as long as its true. The errors key is there to give the user feedback on the received errors.
const initialState = {
  loading: false,
  errors: null
};

/**
 * UI Reducer
 *
 * Manages the UI and Error states for the Preloaded Components
 */
export default function(state = initialState, action) {
  switch (action.type) {
    //Puts the the errors which come from failed requests in the errors state and ends the loading
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        errors: action.payload
      };
    //Clears the Errors state and sets loading to false
    case CLEAR_ERRORS:
      return {
        ...state,
        loading: false,
        errors: null
      };
    //Sets the loading to true
    case LOADING_UI:
      return {
        ...state,
        loading: true
      };
    //Sets the loading to true
    case STOP_LOADING_UI:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
