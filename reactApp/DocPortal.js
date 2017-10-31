import 'babel-polyfill';
import React from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import { MyEditor } from './MyEditor';
import axios from 'axios';


class DocPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.location.pathname.slice(11),
      docs: []
    };
  }
  componentWillMount(){
    axios.get('http://localhost:3000/' + this.props.location.pathname)
    .then((res) => this.setState({docs: res}))
    .catch((err) => {console.log('DocPortal GET request failed', err);});
  }
  render() {
    return (
      <div>
        {

        }
      </div>
    );
  }
}

module.exports = { DocPortal };
