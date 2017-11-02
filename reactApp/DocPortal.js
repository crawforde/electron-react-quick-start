import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AddDocument } from './Modal';
import openSocket from 'socket.io-client';

class DocPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: openSocket('http://localhost:4390'),
      username: this.props.location.pathname.slice(11),
      pathname: this.props.location.pathname,
      docs: [],
      newDocPathname: '',
    };
   this.joinDoc = this.joinDoc.bind(this);
  }
  componentWillMount(){
    axios.get('http://localhost:3000' + this.state.pathname)
    .then((res) => {
      this.setState({docs: res.data});
    })
    .catch((err) => {console.log('DocPortal GET request failed', err);});
    this.state.socket.emit('test', true);
    this.state.socket.on('testsuccess', (test) => {
      console.log(test);
    });
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
  joinDoc(docId){
    this.state.socket.emit('document', docId);
  }
  leaveDoc(docId){
    this.state.socket.emit('document', '');
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
            this.state.docs.map((doc) => {key++; return <p key={key} onClick={() => this.joinDoc(doc._id)}><Link to={`/editorView/${this.state.username}/${doc._id}`}>{doc.title}</Link></p>;})
          }
        </div>
        <AddDocument newDoc={false} username={this.state.username} newDocList={(doc) => this.newDocList(doc)}/>
        </div>
      </div>
    );
  }
}

module.exports = { DocPortal };
