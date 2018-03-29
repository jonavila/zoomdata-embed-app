import { configure } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

configure({ enforceActions: true }); // configure Mobx

ReactDOM.render(<App />, document.getElementById('root'));
