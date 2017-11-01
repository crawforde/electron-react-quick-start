import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class DocPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.pathname.slice(11),
      pathname: this.props.location.pathname,
      docs: [],
      newDocTitle: '',
      newCollabTitle: '',
      password: '',
      cPassword: '',
      newDocPathname: ''
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
  onTitleChange(e){
    this.setState({
      newDocTitle: e.target.value
    });
  }
  onCollabChange(e){
    this.setState({
      newCollabTitle: e.target.value
    });
  }
  onPasswordChange(e){
    this.setState({
      password: e.target.value
    });
  }
  oncPasswordChange(e){
    this.setState({
      cPassword: e.target.value
    });
  }
  newDocument(){
    axios.post('http://localhost:3000/docPortal/new', {
      title: this.state.newDocTitle,
      password: this.state.password,
      username: this.state.username
    })
    .then((doc) => {
      let docs = this.state.docs.slice();
      docs.push(doc);
      this.setState({docs: docs}, this.forceUpdate());
    })
    .catch((err) => {console.log('new Document Post request failed', err);});
  }
  newCollab(){
    axios.post('http://localhost:3000/docPortal/collab', {
      id: this.state.newCollabTitle,
      password: this.state.cPassword,
      username: this.state.username
    })
    .then((doc) => {
      let docs = this.state.docs.slice();
      docs.push(doc);
      this.setState({docs: docs}, this.forceUpdate());
    })
    .catch((err) => {console.log('new Document Post request failed', err);});
  }
  render() {
    return (
      <div>
        <input type='text' onChange={(e) => this.onTitleChange(e)} placeholder="New Document Title" />
        <input type='password' onChange={(e) => this.onPasswordChange(e)} placeholder="Password" />
        <button onClick={() => this.newDocument()}>Create New Document</button>
        <div style={{border: '2px solid lightpink', height: '250px'}}>
          {
            this.state.docs.map((doc) => <p><Link to={`/editorView/${doc._id}`}>{doc.title}</Link></p>)
          }
        </div>
        <input type='text' onChange={(e) => this.onCollabChange(e)} placeholder="New Collaboration Title" />
        <input type='password' onChange={(e) => this.oncPasswordChange(e)} placeholder="Password" />
        <button onClick={() => this.newCollab()}>Add Collaboration</button>
      </div>
    );
  }
}

module.exports = { DocPortal };
