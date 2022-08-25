import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import axios from 'axios';

const users = (state = [], action)=> {
  if(action.type === 'SET_USERS'){
    return action.users;
  }
  if(action.type === 'UPDATE_USER'){
    return state.map(user => user.id === action.user.id ? action.user : user);
  }
  if(action.type === 'CREATE_USER'){
    return [...state, action.user]; 
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

export const toggle = (user)=> {
  return async(dispatch) => {

    const response = await axios.put(`/api/users/${user.id}`, { isAdmin: !user.isAdmin});
    return dispatch({
      user: response.data,
      type: 'UPDATE_USER'
    });

  };
};

export const createUser = (user)=> {
  return async(dispatch) => {
    const response = await axios.post('/api/users', user);
    return dispatch({
      user: response.data,
      type: 'CREATE_USER'
    });
  };
};

export default store;
