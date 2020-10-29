import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.scss';

import { formatDate } from '../lib/formatDate';

import { connect } from 'react-redux';
import { selectDate } from '../store/actions';

class CalendarElement extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
    }

    this.onChange = this.onChange.bind(this)
    this.test = this.test.bind(this)
  }
 
  onChange(date) {
    this.setState({ date })
    const formattedDate = formatDate(date);
    this.props.selectDate(formattedDate);
  }
 
  test({activeStartDate}) {
    let formattedDate = formatDate(this.state.date);
    formattedDate.month = formatDate(activeStartDate).month;
    this.props.selectDate(formattedDate);
  }

  render() {
    return (
      <div>
        <Calendar
          onChange={this.onChange}
          onActiveStartDateChange={this.test}
          value={this.state.date}
          tileClassName={({ date }) => {
            if(this.props.shoppingListDates.dates.find(x => x === formatDate(date).date) && this.props.financeDates.dates.find(x => x === formatDate(date).date)) {
              return  'finance shopping-list'
            } else if (this.props.shoppingListDates.dates.find(x => x === formatDate(date).date)) {
              return  'shopping-list'
            } else if (this.props.financeDates.dates.find(x => x === formatDate(date).date)) {
              return  'finance'
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  selectDate: (payload) => dispatch(selectDate(payload))
});

export default connect( mapStateToProps, mapDispatchToProps )(CalendarElement);
