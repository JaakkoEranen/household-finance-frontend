import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './Widget.scss';

class GroupSettings extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { 
      title: null,
      users: [],
      newUser: "",
      id: null,
    };

    this.addNewUser = this.addNewUser.bind(this);
  }

  componentDidMount() {
    this.fetchGroup(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchGroup(this.props.match.params.id);
    }
  }

  fetchGroup(id) {
    axios.get(process.env.REACT_APP_API_URL + "/groups/"+id, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    })
    .then(({ data }) => {
      this.setState({
        title: data.title,
        users: data.users,
        id: data.id
      });
    });
  }

  addNewUser() {
    let updatedUsers = this.state.users;
    updatedUsers.push(this.state.newUser);

    axios.put(process.env.REACT_APP_API_URL + "/groups/"+this.state.id, {
      id: this.state.id,
      title: this.state.title,
      users: updatedUsers
    }, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    })
    .then(
      this.setState({
        newUser: "",
        users: updatedUsers
      })
    )
    .catch(function (error) {
      console.log(error);
    })
  };

  deleteUser(index) {

    let updatedUsers = this.state.users;
    updatedUsers.splice(index, 1);

    const updatedGroup = {
      id: this.state.id,
      title: this.state.title,
      users: updatedUsers 
    };
    
    axios.put(process.env.REACT_APP_API_URL + "/groups/"+this.state.id, updatedGroup, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    })
    .then(
      this.setState({
        users: updatedUsers
      })
    )
    .catch(function (error) {
      console.log(error);
    })
  };

  render() {
    return (
      <React.Fragment>
        <div key={this.props.groupId} className="widget group-settings">
          
          <h2>{this.state.title}</h2>
  
          <ul className="widget__list group-users">
            {this.state.users ? (this.state.users.map((user,index)=> (
              <li className="group-users__user" key={index}>
                <span className="name">{user}</span>
                <button className="remove" onClick={() => this.deleteUser(index)}>X</button>
              </li>
            ))) : (<></>)}
          </ul>
  
          <div className="widget__add-more group-list__new-user">
            <input
              type="text"
              value={this.state.newUser}
              onChange={({ target }) => this.setState({ newUser: target.value })}
              placeholder="Add User (email)"
            />
            <button onClick={this.addNewUser}>+</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
};

const mapStateToProps = state => ({
  ...state
});

export default connect( mapStateToProps )(GroupSettings);
