import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import './Widget.scss';

import { financeDates } from '../store/actions';

class Finance extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dateList: [],
      finance:  [],
      newFinance: '',
      newCost: 0,
      totalCosts: {}
    };

    this.addNewFinance = this.addNewFinance.bind(this);
    this.removeFinance = this.removeFinance.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedDate.date !== prevProps.selectedDate.date) {
      this.fetchFinance(this.props.groupId, this.props.selectedDate.date);
    }
    if (this.props.selectedDate.month !== prevProps.selectedDate.month) {
      this.fetchFinanceMonth(this.props.groupId, this.props.selectedDate.month);
    }
    if (this.props.profile.jwtToken !== prevProps.profile.jwtToken) {
      this.fetchFinance(this.props.groupId, this.props.selectedDate.date);
      this.fetchFinanceMonth(this.props.groupId, this.props.selectedDate.month);
    }
  }

  componentDidMount() {
    console.log(this.props)
    this.fetchFinance(this.props.groupId, this.props.selectedDate.date);
    this.fetchFinanceMonth(this.props.groupId, this.props.selectedDate.month);
  }

  fetchFinance(id, date) {
    axios
      .get( process.env.REACT_APP_API_URL + "/finance/" + id + "/date/" + date, {
        headers: {
          'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
        }
      })
      .then(({ data }) => {
        this.setState({
          finance: data.finance
        });
        return;
      })
      .catch(function (error) {
        if (error.response.status !== 404) {
          console.log(error);
        }
      });

      this.setState({
        finance: []
      });
  }

  fetchFinanceMonth(id, month) {
    axios
      .get( process.env.REACT_APP_API_URL + "/finance/" + id + "/month/" + month, {
        headers: {
          'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
        }
      })
      .then(({ data }) => {

        this.props.action({dates: data.dateList})

        this.setState({
          dateList: data.dateList,
          totalCosts: data.totalCosts
        });
        return;
      })
      .catch(function (error) {
        if (error.response.status !== 404) {
          console.log(error);
        }
      });

    this.props.action({dates: []})

    this.setState({
      dateList: [],
      totalCosts: []
    });
  }

  addNewFinance() {
    
    let updatedFinance = this.state.finance;
    const user = this.props.profile.userData.attributes.email;
    const newCost = parseInt(this.state.newCost);
    let updatedTotalCosts = this.state.totalCosts;
    const userCosts = (updatedTotalCosts[user] ? updatedTotalCosts[user] : 0);
    updatedTotalCosts[user] = userCosts + newCost;

    this.setState({
      totalCosts: updatedTotalCosts
    })

    if ((updatedFinance.length !== 0) && updatedFinance[user]) {

      updatedFinance[user].push({name: this.state.newFinance, cost: newCost});

      const updatedFinanceData = {
        date: this.props.selectedDate.date,
        id: parseInt(this.props.groupId),
        finance: updatedFinance
      }

      this.updateDatabase(updatedFinanceData);

    } else if ((updatedFinance.length !== 0) && !updatedFinance[user]) {

      updatedFinance[user] = {}
      updatedFinance[user] = [{name: this.state.newFinance, cost: newCost}];

      const updatedFinanceData = {
        date: this.props.selectedDate.date,
        id: parseInt(this.props.groupId),
        finance: updatedFinance
      }

      this.updateDatabase(updatedFinanceData);

    } else {

      updatedFinance = {};
      updatedFinance[user] = {}
      updatedFinance[user] = [{name: this.state.newFinance, cost: newCost}];

      let updatedDateList = Object.assign([], this.state.dateList);
      updatedDateList.push(this.props.selectedDate.date);

      this.props.action({dates: updatedDateList});

      this.setState({
        dateList: updatedDateList
      })

      const newFinanceData = {
        date: this.props.selectedDate.date,
        id: parseInt(this.props.groupId),
        finance: updatedFinance
      }

      this.addDatabase(newFinanceData);

    }

    this.setState({
      newFinance: "",
      finance: updatedFinance,
      newCost: 0
    })

  }

  removeFinance(index) {
    
    let updatedFinance = this.state.finance;
    const user = this.props.profile.userData.attributes.email;
    let updatedTotalCosts = this.state.totalCosts;
    updatedTotalCosts[user] = updatedTotalCosts[user] - updatedFinance[user][index].cost;
    
    this.setState({
      totalCosts: updatedTotalCosts
    })

    delete updatedFinance[user].splice(index, 1);

    if (updatedFinance[user].length === 0) {

      delete updatedFinance[user];

      if (Object.keys(updatedFinance).length === 0) {

        let updatedDateList = Object.assign([], this.state.dateList);
        const dateIndex = updatedDateList.indexOf(this.props.selectedDate.date);
        updatedDateList.splice(dateIndex, 1);
        
        this.props.action({dates: updatedDateList})

        this.deleteDatabase();
        this.setState({
          finance: [],
          dateList: updatedDateList
        })
        return;
      }

      const updatedFinanceData = {
        id: parseInt(this.props.groupId),
        date: this.props.selectedDate.date,
        finance: updatedFinance
      }

      this.updateDatabase(updatedFinanceData);
      
    } else {

      const updatedFinanceData = {
        id: parseInt(this.props.groupId),
        date: this.props.selectedDate.date,
        finance: updatedFinance
      }

      this.updateDatabase(updatedFinanceData);

    }

    this.setState({
      finance: updatedFinance 
    })

  }

  addDatabase(object) {
    axios.post(process.env.REACT_APP_API_URL + "/finance", JSON.stringify(object), {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    } )
      .catch(function (error) {
        console.log(error);
      })
  }

  updateDatabase(object) {
    axios.put(process.env.REACT_APP_API_URL + "/finance/"+this.props.groupId+"/date/"+this.props.selectedDate.date, JSON.stringify(object), {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    } )
      .catch(function (error) {
        console.log(error);
      })
  }

  deleteDatabase() {
    axios.delete(process.env.REACT_APP_API_URL + "/finance/"+this.props.groupId+"/date/"+this.props.selectedDate.date, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    } )
      .catch(function (error) {
        console.log(error);
      })
  }

  renderFinanceList(user) {
    const items = [];
    const list = this.state.finance[user];

    list.map((item, index) => (
      items.push(
        <li className="user-costs__cost" key={index}>
          <span className="name">{item.name}:</span>
          <span className="cost">{item.cost}</span>
          {(this.props.profile.userData.attributes.email === user ? <button className="remove" onClick={() => this.removeFinance(index)}>X</button> : '')}
        </li>
      )
    ));

    return items;
  }

  renderFinances() {
    const finances = [];

    if (this.state.finance.length === 0) {
      return finances;
    }
    
    for (const user in this.state.finance) {
      finances.push(
        <li className="finance__list__user" key={user}>
          <p>{user}:</p>
          <ul className="user-costs">
            {this.renderFinanceList(user)}
          </ul>
        </li>
      )
    }

    return finances;
  }

  renderTotalCosts() {
    const totalCosts = [];
    
    for (const user in this.state.totalCosts) {
      totalCosts.push(
        <li key={user}>
          {user}: <span className="cost">{this.state.totalCosts[user]} €</span>
        </li>
      )
    }

    return {totalCosts};
  }

  render() {
    const finances = this.renderFinances();
    const totalCosts = this.renderTotalCosts();

    return (
      <div className="finance">
        <h2>Finance</h2>
        <ul className="widget__list finance__list">
          {finances}
        </ul>
        <div className="widget__add-more finance__new-cost">
          <input
            type="text"
            value={this.state.newFinance}
            onChange={({ target }) => this.setState({newFinance: target.value})}
          />
          <input
            type="number"
            value={this.state.newCost}
            onChange={({ target }) => this.setState({newCost: target.value})}
          />
          <button onClick={this.addNewFinance}>+</button>
        </div>
        <div className="finance__info">
          <h3>Total costs in this month</h3>
          <ul className="finance__info__list">{totalCosts.totalCosts}</ul>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  action: (payload) => dispatch(financeDates(payload))
});

export default connect( mapStateToProps, mapDispatchToProps )(Finance);