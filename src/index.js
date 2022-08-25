import React from 'react';
import { createRoot } from 'react-dom/client';
import store, { fetchUsers, toggle, createUser } from './store';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { Provider, connect } from 'react-redux';

const root = createRoot(document.querySelector('#root'));

const Create = connect(
  null,
  dispatch => {
    return {
      createUser: (user)=> dispatch(createUser(user))
    }
  }
)(
  class Create extends React.Component{
    constructor(){
      super();
      this.state = {
        name: '',
        isAdmin: false,
        error: ''
      };
      this.create = this.create.bind(this);
    }
    async create(ev){
      ev.preventDefault();
      const user = { 
        name: this.state.name,
        isAdmin: this.state.isAdmin
      };
      try {
        await this.props.createUser(user);
        this.props.history.push('/users');
      }
      catch(ex){
        this.setState({ error: 'something went wrong'});
      }
    }
    render(){
      const { error, isAdmin, name } = this.state;
      return (
        <form onSubmit={ this.create }>
          { error }
          <input name='name' value={ name } onChange={ ev => this.setState({ name: ev.target.value })}/>
          <label>
            isAdmin
            <input type='checkbox' checked={ isAdmin } name='isAdmin' onChange={ ev => this.setState({ isAdmin: ev.target.checked })}/>
          </label>
          <button>Create</button>
        </form>
      );
    }
  }
);

const Nav = connect(
  state => state
)(
  ({ location, users })=> {
    const path = location.pathname;
    return (
      <nav>
        <Link to='/' className={ path === '/' ? 'selected': ''}>Home</Link>
        <Link to='/users' className={ path === '/users' ? 'selected': ''}>Users ({ users.length})</Link>
        <Link to='/users/create' className={ path === '/users/create' ? 'selected': ''}>Create</Link>
      </nav>
    );
  }
);


const Users = connect(
  state => state,
  dispatch => {
    return {
      toggle: (user)=> dispatch(toggle(user))
    };
  }
)(({ users, toggle})=> {
  return (
    <ul>
      {
        users.map( user => {
          return (
            <li key={ user.id }>
              { user.name }
              <button onClick={ ()=> toggle(user)}>{ user.isAdmin ? 'demote' : 'promote'}</button>
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
        <Route component={ Nav } />
        <h1>Acme User Directory ({ users.length })</h1>
        <Route exact path='/users' component={ Users } />
        <Route path='/users/create' component={ Create } />
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
