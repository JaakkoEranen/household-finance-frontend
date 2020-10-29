import React from "react";

import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import ShoppingList from "../components/ShoppingList";
import CalendarElement from "../components/Calendar";
import Finance from "../components/Finance";

class Group extends React.Component {

  constructor(props) {
    super(props);

    this.state = { 
      title: "",
      users: [],
      id: null
    };
  }

  componentDidMount() {
    console.log(this.props.match.params.id)
    console.log(this.props)
    this.fetchGroup(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id || this.props.profile.jwtToken !== prevProps.profile.jwtToken){
      this.fetchGroup(this.props.match.params.id);
    }
  }

  fetchGroup(id) {
    console.log("TEST")
    axios.get(process.env.REACT_APP_API_URL + "/groups/"+id, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    })
    .then(({ data }) => {
      console.log(data, 'data')
      this.setState({
        title: data.title,
        users: data.users,
        id: data.id
      });
    });
  }

  render() {
    return ( 
      <div className="main">
        <Link to="/" className="close-button"></Link>
        <h1>{this.state.title}</h1>
        <div className="widgets">
          <CalendarElement />
          <div className="widget group-widgets">
            <ShoppingList groupId={this.props.match.params.id} />
            <Finance groupId={this.props.match.params.id} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

export default connect( mapStateToProps, null )(Group);