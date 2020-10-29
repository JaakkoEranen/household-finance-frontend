import React from "react";

import { Auth } from "aws-amplify";
import { Link } from "react-router-dom";
import './Form.scss';


class Signup extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      newUser: null
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
  }

  validateForm() {
    return (
      this.state.email.length > 0 &&
      this.state.password.length > 0 &&
      this.state.password === this.state.confirmPassword
    );
  }

  validateConfirmationForm() {
    return this.state.confirmationCode.length > 0;
  }

  async handleSubmit(event) {
    event.preventDefault();
  
    try {
      const newUser = await Auth.signUp({
        username: this.state.email,
        password: this.state.password,
        attributes: {
          email: this.state.email,
          name: this.state.name,
        }
      });
      this.setState({
        newUser
      });
    } catch (e) {
      alert(e.message);
    }
  }
  
  async handleConfirmationSubmit(event) {
    event.preventDefault();
  
  
    try {
      await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
      await Auth.signIn(this.state.email, this.state.password);
  
      this.props.history.push("/");
    } catch (e) {
      alert(e.message);
    }
  }

  renderConfirmationForm() {
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        
          <p>Confirmation Code</p>
          <input
            autoFocus
            type="tel"
            name="confirmationCode"
            onChange={this.handleFieldChange}
            value={this.state.confirmationCode}
          />
          <p>Please check your email for the code.</p>

        <input
          block
          type="submit"
          disabled={!this.validateConfirmationForm()}
          value="Verify"
        />
      </form>
    );
  }

  handleFieldChange(value, name) {
    // eslint-disable-next-line default-case
    switch (name) {
      case 'name':
        this.setState({
          name: value
        });
        break;
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
      case 'confirmPassword':
        this.setState({
          confirmPassword: value
        });
        break;
    }
  }

  renderForm() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={this.state.name} autoFocus onChange={({ target }) => this.handleFieldChange(target.value, target.name)} />
        <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={({ target }) => this.handleFieldChange(target.value, target.name)} />
        <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={({ target }) => this.handleFieldChange(target.value, target.name)} />
        <input type="password" name="confirmPassword" placeholder="Confirm password" value={this.state.confirmPassword} onChange={({ target }) => this.handleFieldChange(target.value, target.name)} />
        <input type="submit" disabled={!this.validateForm()} value="Signup" />
      </form>
    );
  }

  render() {
    return (
      <div className="Signup form-wrapper">
        <Link to="/" className="close-button"></Link>
        <h1>Signup</h1>
        {this.state.newUser === null ? this.renderForm() : this.renderConfirmationForm()}
      </div>
    )
  }
}

export default Signup;