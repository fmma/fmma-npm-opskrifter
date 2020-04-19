import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './components/App/App';
import * as serviceWorker from './serviceWorker';

// This import loads the firebase namespace along with all its type information.
import * as firebase from 'firebase/app';

// These imports load individual services into the firebase namespace.
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCn9NrmdUgPXF8_DUAmopVgtP68S4FdnLo",
  authDomain: "opskriftapp.firebaseapp.com",
  databaseURL: "https://opskriftapp.firebaseio.com",
  projectId: "opskriftapp",
  storageBucket: "opskriftapp.appspot.com",
  messagingSenderId: "888856083851",
  appId: "1:888856083851:web:c576b771d3627e62ab438e",
  measurementId: "G-F1SD1FP2S9"
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
