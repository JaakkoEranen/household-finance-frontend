import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './Widget.scss';

import { shoppingListDates } from '../store/actions';

class ShoppingList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dateList: [],
      products:  [],
      newProduct: "",
      checkedProducts: [] 
    };

    this.addNewProduct = this.addNewProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount() {
    this.fetchList(this.props.groupId, this.props.selectedDate.date);
    this.fetchDateList(this.props.groupId, this.props.selectedDate.month);
  }

  componentDidUpdate(previousProps) {
    if (previousProps.groupId !== this.props.groupId) {
      this.fetchList(this.props.groupId, this.props.selectedDate.date);
    }
    if (this.props.selectedDate.date !== previousProps.selectedDate.date) {
      this.fetchList(this.props.groupId, this.props.selectedDate.date);
    }
    if (this.props.selectedDate.month !== previousProps.selectedDate.month) {
      this.fetchDateList(this.props.groupId, this.props.selectedDate.month);
    }
    if (this.props.profile.jwtToken !== previousProps.profile.jwtToken) {
      this.fetchList(this.props.groupId, this.props.selectedDate.date);
      this.fetchDateList(this.props.groupId, this.props.selectedDate.month);
    }
  }

  fetchList(id, date) {
    axios
      .get( process.env.REACT_APP_API_URL + "/shopping-list/"+id+"/date/"+date, {
          headers: {
            'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
          }
        })
      .then(({ data }) => {
          this.setState({
            products: data.items
          });
          return;
      })
      .catch(function (error) {
        if (error.response.status !== 404) {
          console.log(error);
        }
      });

      this.setState({
        products: []
      });
  }

  fetchDateList(id, month) {
    axios
      .get( process.env.REACT_APP_API_URL + "/shopping-list/"+id+"/month/"+month, {
        headers: {
          'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
        }
      })
      .then(({ data }) => {
        
        this.props.action({dates: data.dateList})

        this.setState({
          dateList: data.dateList
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
      dateList: []
    });
  }
  
  addNewProduct() {

    let updatedProducts = this.state.products;

    if (updatedProducts.length === 0) {

      updatedProducts = [this.state.newProduct];
      let updatedDateList = Object.assign([], this.state.dateList);
      updatedDateList.push(this.props.selectedDate.date);

      this.props.action({dates: updatedDateList});

      const newShoppingList = {
        id: parseInt(this.props.groupId),
        items: updatedProducts,
        date: this.props.selectedDate.date
      };

      this.addDatabase(newShoppingList);

      this.setState({
        newProduct: "",
        dateList: updatedDateList
      })

    } else {

      updatedProducts.push(this.state.newProduct);

      const updatedShoppingList = {
        id: parseInt(this.props.groupId),
        items: updatedProducts,
        date: this.props.selectedDate.date
      };

      this.updateDatabase(updatedShoppingList);

      this.setState({
        newProduct: ""
      })

    }

    this.setState({
      products: updatedProducts
    })

  };

  removeProduct(index) {

    let updatedProducts = this.state.products;

    updatedProducts.splice(index, 1);

    this.setState({
      products: updatedProducts 
    })
  
    if (updatedProducts.length === 0) {
      
      let updatedDateList = Object.assign([], this.state.dateList);
      const dateIndex = updatedDateList.indexOf(this.props.selectedDate.date);
      updatedDateList.splice(dateIndex, 1);

      this.props.action({dates: updatedDateList})

      this.setState({
        dateList: updatedDateList
      });

      this.deleteDatabase();

    } else {

      const updatedShoppingList = {
        id: parseInt(this.props.groupId),
        items: updatedProducts,
        date: this.props.selectedDate.date
      };

      this.updateDatabase(updatedShoppingList);
    }
    
  };

  addDatabase(object) {
    axios.post(process.env.REACT_APP_API_URL + "/shopping-list", JSON.stringify(object), {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    } )
      .catch(function (error) {
        console.log(error);
      })
  }

  updateDatabase(object) {
    axios.put(process.env.REACT_APP_API_URL + "/shopping-list/"+this.props.groupId+"/date/"+this.props.selectedDate.date, JSON.stringify(object), {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    } )
      .catch(function (error) {
        console.log(error);
      })
  }

  deleteDatabase() {
    axios.delete(process.env.REACT_APP_API_URL + "/shopping-list/"+this.props.groupId+"/date/"+this.props.selectedDate.date, {
      headers: {
        'Authorization': `Bearer ${(this.props.profile.jwtToken)}`
      }
    } )
      .catch(function (error) {
        console.log(error);
      })
  }

  setNewProductTitle(product) {
    this.setState({
      newProduct: product
    })
  }

  handleCheck(e, index) {
    e.target.classList.toggle('done');
    e.target.parentNode.getElementsByClassName('product')[0].classList.toggle('done');
    // this.state.checkedProducts[this.state.date].push(index);
  }

  render() {
    return (
      <div className="shopping-list">
        <h2>Shopping List</h2>
        <ul className="widget__list shopping-list__products">
          {this.state.products ? (this.state.products.map((product, index) => (
            <li key={index}>
              <button className="checkmark" onClick={(e) => this.handleCheck(e, index)}>&#10003;</button>
              <span className="product">{product}</span>
              <button className="remove" onClick={() => this.removeProduct(index)}>X</button>
            </li>
          ))) : (<></>)}
        </ul>
        <div className="widget__add-more shopping-list__new-product">
          <input
            type="text"
            value={this.state.newProduct}
            onChange={({ target }) => this.setNewProductTitle(target.value)}
          />
          <button onClick={this.addNewProduct}>+</button>
        </div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  action: (payload) => dispatch(shoppingListDates(payload))
});


export default connect( mapStateToProps, mapDispatchToProps )(ShoppingList);