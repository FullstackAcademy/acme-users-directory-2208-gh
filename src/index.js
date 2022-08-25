import React from 'react';
import { createRoot } from 'react-dom/client';
import store, { fetchUsers } from './store';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { Provider, connect } from 'react-redux';

const root = createRoot(document.querySelector('#root'));


const Users = connect(
  state => state,
)(({ users})=> {
  return (
    <ul>
      {
        users.map( user => {
          return (
            <li key={ user.id }>
              { user.name }
            </li>
          );
        })
      }
    </ul>
  );
});

const App = connect(
  state => state,
  dispatch => {
    return {
      fetchUsers: ()=> dispatch(fetchUsers())
    }
  }
)(class App extends React.Component{
  componentDidMount(){
    this.props.fetchUsers();
  }
  render(){
    const { users } = this.props;
    return (
      <div>
        <h1>Acme User Directory ({ users.length })</h1>
        <Users />
      </div>
    );
  }
});

root.render(
  <Provider store={ store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
