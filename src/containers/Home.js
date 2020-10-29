import React from "react";

import GroupList from "../components/GroupList";
import GroupSettings from '../components/GroupSettings';
import './Home.scss';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Home extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      isLoading: true
    };
  }
  
  componentDidMount() {
    this.onLoad();
  };

  onLoad() {
    if (this.props.appProps.isAuthenticated) {
      return;
    }

    this.setState({isLoading: false});
  }

  renderLander() {
    return (
      <div className="main">
        <h1>Welcome to the home!</h1>
        <p>Here you can organize a Family finance and etc.</p>
      </div>
    );
  }

  renderLoggedInLander() {
    return (
      <React.Fragment>
        <div className="main">
          <h1>Welcome {Object.keys(this.props.profile.userData).length > 0 ? this.props.profile.userData.attributes.name : ""}</h1>
          <div className="widgets">
            <GroupList lastGroupId={this.props.lastGroupId} match={this.props.match} />
            {this.props.match.params.id ? (
              <GroupSettings 
              groupId={this.props.match.params.id}
              match={this.props.match}
              />
            ) : (<></>)}
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return ( this.props.appProps.isAuthenticated ? this.renderLoggedInLander() : this.renderLander() );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default withRouter(connect( mapStateToProps )(Home));