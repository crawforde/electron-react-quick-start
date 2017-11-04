import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import axios from 'axios';
/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err;});

class UserValidation extends React.Component {
  render() {
    return (
      <div>
        <h1>FakeDocs User Validation</h1>
        <Login />
      </div>
    );
  }
}


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      redirect: false
    };
  }
  onNameChange(e){
    this.setState({
      username: e.target.value
    });
  }
  onPasswordChange(e){
    this.setState({
      password: e.target.value
    });
  }
  login(){
    axios.post('http://localhost:3000/login',{
      username: this.state.username,
      password: this.state.password
    })
    .then(() => this.setState({redirect: true}))
    .catch((err) => {console.log('Login Post request failed', err);});
  }
  render() {
    return (this.state.redirect) ? (<Redirect to={`/docPortal/${this.state.username}`}/>) :
    (
      <div id="loginHeader">
        <div className="topCorner">
          <button className="topCornerButton"><Link to={'/register'}>Register</Link></button>
        </div>
        <div id="loginMain">
          <h1>Docbright</h1>
          <div id="loginButtons">
            <div className="inputWithSymbol">
              <div><span className="fa fa-user"/></div>
              <input type='text' onChange={(e) => this.onNameChange(e)} placeholder="Username" />
            </div>
            <div className="inputWithSymbol">
              <div><span className="fa fa-unlock-alt"/></div>
              <input type='password' onChange={(e) => this.onPasswordChange(e)} placeholder="Password" />
            </div>
            <button id="loginButton" onClick={() => this.login()}>Login</button>
          </div>
        </div>
      </div>
    );
  }
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      firstName: '',
      redirect: false
    };
  }
  onUsernameChange(e){
    this.setState({
      username: e.target.value
    });
  }
  onPasswordChange(e){
    this.setState({
      password: e.target.value
    });
  }
  onFirstNameChange(e){
    this.setState({
      firstName: e.target.value
    });
  }
  register(){
    axios.post('http://localhost:3000/register',{
      username: this.state.username,
      password: this.state.password,
      firstName: this.state.firstName
    }, {
      withCredentials: true
    })
    .then(() => this.setState({redirect: true}))
    .catch((err) => {console.log('Register Post request failed', err);});
  }
  render() {

    return (this.state.redirect) ? (<Redirect to={'/login'}/>) : (
      <div className='login-container'>
        <h1>Register for FakeDocs!</h1>
        <Link to={'/login'}>Click here to Login</Link>
        <div>
          <input type='text' onChange={(e) => this.onFirstNameChange(e)} placeholder="First Name" />
          <input type='text' onChange={(e) => this.onUsernameChange(e)} placeholder="Username" />
          <input type='password' onChange={(e) => this.onPasswordChange(e)} placeholder="Password" />
          <button onClick={() => this.register()}>Register</button>
        </div>
      </div>
    );
  }
}

module.exports= { UserValidation, Login, Register };
