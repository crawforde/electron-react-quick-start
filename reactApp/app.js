<<<<<<< HEAD
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
=======
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';

>>>>>>> 58e65781867adfac947bd7840c81b10e4ea31efc
/* This can check if your electron app can communicate with your backend */
fetch('http://localhost:3000')
.then(resp => resp.text())
.then(text => console.log(text))
.catch(err => {throw err;});

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }
  render() {
    return (
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
    );
  }
}
ReactDOM.render(
 <MyEditor />,
 document.getElementById('root')
);
