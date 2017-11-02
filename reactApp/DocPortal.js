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
  render() {
    let key = 0;
    return (
      <div>
        <AddDocument newDoc={true} username={this.state.username} newDocList={(doc) => this.newDocList(doc)} />
        <div style={{border: '2px solid lightpink'}}>
          {
            this.state.docs.map((doc) => {key++; return <p key={key}><Link to={`/editorView/${doc._id}`}>{doc.title}</Link></p>;})
          }
        </div>
        <AddDocument newDoc={false} username={this.state.username} newDocList={(doc) => this.newDocList(doc)}/>
      </div>
    );
  }
}

module.exports = { DocPortal };
