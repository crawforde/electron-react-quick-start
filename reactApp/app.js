import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import { Login, Register, UserValidation } from './Login';
import { DocPortal } from './DocPortal';
import MyEditor from './MyEditor';
/* This can check if your electron app can communicate with your backend */
// fetch('http://localhost:3000')
// .then(resp => resp.text())
// .then(text => console.log(text))
// .catch(err => {throw err;});

class Home extends React.Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={UserValidation} />
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/docPortal/:username" component={DocPortal}/>
          <Route path="/editorView/:username/:docId" component={MyEditor}/>
        </div>
      </HashRouter>
    );
  }
}
ReactDOM.render(
  <Home />,
  document.getElementById('root')
);
