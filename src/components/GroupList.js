import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Link, withRouter } from "react-router-dom";
import './Widget.scss';

class GroupList extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = { 
      groups:  [],
      nextGroupId: 0,
      newGroupTitle: "",
      isLoading: true
    };

    this.addNewGroup = this.addNewGroup.bind(this);
  }

  async componentDidMount() {
    this.setState({
      isLoading: true
    })
    this.fetchGroups();
  }

  fetchGroups() {
    axios.get(process.env.REACT_APP_API_URL + "/groups/", {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    })
      .then(({ data }) => {
        if ( data.length > 0 ) {
          this.setState({ 
            nextGroupId:  Math.max.apply(Math, data.map(function(o) { return o.id; })) + 1,
            groups: data,
            isLoading: false
          });
        } else {
          this.setState({ 
            nextGroupId:  1,
            groups: data,
            isLoading: false
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  addNewGroup() {

    const newGroup = {
      id: this.state.nextGroupId,
      title: this.state.newGroupTitle,
      users: [this.props.profile.userData.attributes.email]
    };

    let updatedGroups = this.state.groups;
    updatedGroups.push(newGroup);

    axios.post(process.env.REACT_APP_API_URL + "/groups/", newGroup, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    })
    .then(
      this.setState({
        groups: updatedGroups,
        nextGroupId: this.state.nextGroupId + 1,
        newGroupTitle: ""
      })
    )
    .catch(function (error) {
      console.log(error);
    })
  };

  placeholder() {
    console.log("TESTiäää")
    return (
      <React.Fragment>
        <li className="placehoder"></li>
        <li className="placehoder"></li>
        <li className="placehoder"></li>
        <li className="placehoder"></li>
      </React.Fragment>
    )
  }

  render() {
    
    const groups = this.state.groups.map((group, index) => (
      (group.users.includes(this.props.profile.userData.attributes.email)) ? (
        <React.Fragment key={index}>
          <li>
            <Link to={"/group/"+group.id}>{group.title}</Link>
            <Link to={"/group-settings/"+group.id} className="settings-button">⚙</Link>
          </li>
        </React.Fragment>
      ) : ""
    ));

    const placeholder = (
      <React.Fragment>
        <li className="placeholder"></li>
        <li className="placeholder"></li>
        <li className="placeholder"></li>
        <li className="placeholder"></li>
      </React.Fragment>
    )
        
    return (
      <React.Fragment>
        <div className="widget group-list">
          
          <h1>Groups</h1>
          
          <ul className="widget__list group-list__products">
            {groups && !this.state.isLoading ? (groups) : (placeholder)}
          </ul>

          <div className="widget__add-more group-list__new-group">
            <input
              type="text"
              value={this.state.newGroupTitle}
              onChange={({ target }) => this.setState({newGroupTitle: target.value})}
              placeholder="Add Group"
            />
            <button onClick={this.addNewGroup}>+</button>
          </div>
          
        </div>
      </React.Fragment>
    );
  }
};

const mapStateToProps = state => ({
  ...state
});


export default withRouter(connect( mapStateToProps )(GroupList));