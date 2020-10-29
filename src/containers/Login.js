import React from "react";
import { connect } from 'react-redux';
import { getProfile } from '../store/actions';
import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import './Form.scss';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      email: "",
      password: ""
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  async handleSubmit(event) {
    event.preventDefault();

    try {
      await Auth.signIn(this.state.email, this.state.password);
      this.setState({
        isAuthenticated: true 
      });
      const currentSession = await Auth.currentSession();
      const userInfo = await Auth.currentUserInfo();

      await this.props.action({user: userInfo, jwtToken: currentSession.idToken.jwtToken})
      this.props.handler(true);
      await this.props.history.push("/");
      return;
    } catch (e) {
      alert(e.message);
    }

  }

  handleFieldChange(value, name) {
    // eslint-disable-next-line default-case
    switch (name) {
      case 'email':
        this.setState({
          email: value
        });
        break;
      case 'password':
        this.setState({
          password: value
        });
        break;
    }
  }

  render() {
    return (
      <div className="Login form-wrapper">
        <Link to="/" className="close-button"></Link>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <input type="email" name="email" placeholder="Email" value={this.state.email} autoFocus onChange={({ target }) => this.handleFieldChange(target.value, target.name)} />
          <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={({ target }) => this.handleFieldChange(target.value, target.name)} />
          <input type="submit" disabled={!this.validateForm()} value="Login" />
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  action: (payload) => dispatch(getProfile(payload))
});

export default connect( null, mapDispatchToProps )(Login);