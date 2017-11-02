import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AddDocument } from './Modal';
//import openSocket from 'socket.io-client';
//https://aae1cc2e.ngrok.io/
//http://localhost:4390
class DocPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
  //    socket: openSocket('https://aae1cc2e.ngrok.io/'),
      username: this.props.location.pathname.slice(11),
      pathname: this.props.location.pathname,
      docs: [],
      newDocPathname: '',
    };
  }
  componentWillMount(){
    axios.get('http://localhost:3000' + this.state.pathname)
    .then((res) => {
      this.setState({docs: res.data});
    })
    .catch((err) => {console.log('DocPortal GET request failed', err);});
  }
  newDocList(doc){
    this.setState({
      docs: [...this.state.docs, doc]
    });
  }
  logout(){
    axios.get('http://localhost:3000/logout')
    .then(() => this.props.history.push('/login'))
    .catch((err) => {
      console.log('Logout failed', err);
    });
  }
  render() {
    let key = 0;
    return (
      <div>
        <button onClick={() => this.logout()}>Log Out</button>
        <div>
        <AddDocument newDoc={true} username={this.state.username} newDocList={(doc) => this.newDocList(doc)} />
        <div style={{border: '2px solid lightpink'}}>
          {
            this.state.docs.map((doc) => {key++; return <p key={key}><Link to={`/editorView/${this.state.username}/${doc._id}`}>{doc.title}</Link></p>;})
          }
        </div>
        <AddDocument newDoc={false} username={this.state.username} newDocList={(doc) => this.newDocList(doc)}/>
        </div>
      </div>
    );
  }
}

module.exports = { DocPortal };
