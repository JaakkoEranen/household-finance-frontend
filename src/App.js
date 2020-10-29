import React from "react";
import { Link, withRouter } from "react-router-dom";
import './App.scss';
import Routes from './Routes';

import { connect } from 'react-redux';
import { getProfile } from './store/actions';
// import { Auth } from 'aws-amplify';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      isAuthenticating: true,
      isAuthenticated: false,
      handler: this.handler
    };

    this.handler = this.handler.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.onLoad();
  }
  
  async onLoad() {
    try {
      // const currentSession = await Auth.currentSession();
      const currentSession = {
        idToken: {
          jwtToken: "jwtToken",
          payload: { 
            sub:"sub",
            aud: "aud",
            email_verified: true,
            event_id: "event_id",
            token_use: "id",
            auth_time: 0,
            iss: "cognito.domain",
            name: "Test User",
            username: "username",
            exp: 0,
            iat: 0,
            email: "test1@test.com"
          }
        },
        refreshToken: {
          token: "token"
        },
        accessToken: {
          jwtToken: "jwtToken",
          payload: {
            sub: "sub",
            event_id: "event_id",
            token_use: "access",
            scope: "aws.cognito.signin.user.admin",
            auth_time: 0,
            iss: "cognito.domain",
            exp: 0,
            iat: 0,
            jti: "jti", 
            client_id: "client_id",
            username: "username"
          }
        },
        clockDrift: 0
      }
      // const userInfo = await Auth.currentUserInfo();
      const userInfo = {
        username: "username",
        attributes: {
          sub: "sub",
          email_verified:true,
          name: "Test User",
          email: "test@test.com"
        }
      }

      await this.props.action({user: userInfo, jwtToken: currentSession.idToken.jwtToken})

      this.setState({
        isAuthenticated: true,
      })
      return;
    }
    catch(e) {
      if (e !== 'No current user') {
        alert(e);
      }
    }
    this.setState({
      isAuthenticated: false,
    })
  }

  async handleLogout() {
    await this.props.action({
      user: {
        attributes: {
            email: null
        }
      }, 
      jwtToken: null
    })
    // await Auth.signOut();

    this.setState({
      isAuthenticated: false
    })

    await this.props.history.push("/login");
  }

  handler(isAuthenticated) {
    this.setState({
      isAuthenticated
    })
  }

  render() {
    return (
      this.state.isAuthenticating &&
      <div className={'App container ' + (this.state.isAuthenticated ? 'logged-in' : 'logged-out')}>
        <div className="nav">
          <Link to="/">Home</Link>
          <div className="user-links">
          {this.state.isAuthenticated
            ? <p className="link" onClick={this.handleLogout}>Log out</p>
            : <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
              </>
          }
          </div>
        </div>
        <Routes appProps={this.state} handler={this.handler} />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  action: (payload) => dispatch(getProfile(payload))
});

export default withRouter(connect( null, mapDispatchToProps )(App));