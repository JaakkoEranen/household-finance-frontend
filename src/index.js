import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import store from "./store/store";
import {Provider} from "react-redux";

// import Amplify, { Auth } from 'aws-amplify';
// import config from './config';

// Amplify.configure({
//   Auth: {
//     mandatorySignIn: true,
//     region: config.cognito.REGION,
//     userPoolId: config.cognito.USER_POOL_ID,
//     identityPoolId: config.cognito.IDENTITY_POOL_ID,
//     userPoolWebClientId: config.cognito.APP_CLIENT_ID
//   },
//   API: {
//     endpoints: [
//       {
//         name: "groups",
//         endpoint: config.apiGateway.URL,
//         region: config.apiGateway.REGION,
//         custom_header: async () => { 
//           return { Authorization: `Bearer ${(await Auth.currentSession()).idToken.jwtToken}` }
//         }
//       }
//     ]
//   }
// });

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();