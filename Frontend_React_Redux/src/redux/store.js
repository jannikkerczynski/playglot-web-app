//Redux
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
//The three different Reducers
import userReducer from "./reducers/userReducer";
import dataReducer from "./reducers/dataReducer";
import uiReducer from "./reducers/uiReducer";

//The State which we initate our store with
const initState = {};

//The three different reducers combined through the given Redux method
const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  UI: uiReducer
});

/**The createStore method takes our combined reducers, the initial state and enhancer which is composed out of our Middleware
 * which receives thunk as a parameter so we can have the feature of injecting functions to our actions
 */

const store = createStore(
  reducers,
  initState,
  compose(
    //Middleware to use functions and asynchronous dispatches
    applyMiddleware(thunk),
    //Enables the Redux DevTools for better Debugging in Development
    //Should be disabled in Production side
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
