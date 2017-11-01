import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AddDocument } from './Modal';

class DocPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.pathname.slice(11),
      pathname: this.props.location.pathname,
      docs: [],
      newDocPathname: '',
    };
  }
  componentWillMount(){
    axios.get('http://localhost:3000' + this.state.pathname)
    .then((res) => {
      console.log('component will mount', res);
      this.setState({docs: res.data});
    })
    .catch((err) => {console.log('DocPortal GET request failed', err);});
  }
  componentDidUpdate(){
    axios.get('http://localhost:3000' + this.state.pathname)
    .then((res) => {
      console.log('component will mount', res);
      this.setState({docs: res.data});
    })
    .catch((err) => {console.log('DocPortal GET request failed', err);});
  }
  render() {
    let key = 0;
    return (
      <div>
        <AddDocument newDoc={true} username={this.state.username} docs={this.state.docs}/>
        <div style={{border: '2px solid lightpink'}}>
          {
            this.state.docs.map((doc) => {key++; return <p key={key}><Link to={`/editorView/${doc._id}`}>{doc.title}</Link></p>;})
          }
        </div>
        <AddDocument newDoc={false} username={this.state.username} docs={this.state.docs}/>
      </div>
    );
  }
}

module.exports = { DocPortal };
