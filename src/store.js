import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const users = (state = [], action)=> {
  if(action.type === 'SET_USERS'){
    return action.users;
  }
  return state;
};

const store = createStore(
  combineReducers({
    users
  }),
  applyMiddleware(logger, thunk)
);

export const fetchUsers = ()=> {
  return async(dispatch) => {
    const response = await axios.get('/api/users');
    return dispatch({
      users: response.data,
      type: 'SET_USERS'
    });

  };
};

export default store;
