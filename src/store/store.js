import {createStore, applyMiddleware, compose} from "redux";
import rootReducer from './reducers';

const logger = store => next => action => {
  let result = next(action)
  return result
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore( rootReducer, composeEnhancers(applyMiddleware(logger)) );

export default store;

