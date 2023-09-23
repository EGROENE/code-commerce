import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Confirmation from "./Components/Confirmation/Confirmation";
import Login from "./Components/Login/Login";
import Cart from "./Components/Cart/Cart";
import { ITEMS_IN_CART } from "./constants";
import Shipping from "./Components/Shipping/Shipping";
import Payment from "./Components/Payment/Payment";

// Get rid of constructor
// Put methods specific to components in those components themselves. Use setters (defined here) to change any state values.
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arePagesComplete: {
        isLoginComplete: false,
        isCartComplete: false,
        isShippingComplete: false,
        isPaymentComplete: false,
        isConfirmationComplete: false,
      },
      accountEmailAddress: "",
      itemsInCart: ITEMS_IN_CART,
      numberOfItemsInCart: ITEMS_IN_CART.length,
      discountRate: 0,
      shippingDetails: {
        name: "",
        streetAddress: "",
        postalCode: "",
        city: "",
        stateOrTerritory: "",
        phoneNumber: "",
        phoneNumberMask: "",
      },
      shippingAndHandling: 50,
      deliveryTime: "3 seconds",

      paymentDetails: {
        cardType: "",
        cardHolder: "",
        cardNumber: "",
        cardNumberMask: "",
        expiryMonth: "",
        expiryYear: "",
        securityCode: "",
        cardImage: "",
      },

      // State values for Confirmation
      isOrderSummaryDisplayed: false,
    };
  }

  // UNIVERSAL METHODS

  // Method to move to next page:
  // Pass this as prop to children, except for Confirmation
  toNextPage = (e, pageCompleted) => {
    e.preventDefault();

    this.setState((prevState) => ({
      ...prevState,
      arePagesComplete: {
        ...prevState.arePagesComplete,
        [`is${pageCompleted}Complete`]: true,
      },
    }));
  };

  // Method to go to previous page:
  // Pass this as prop to children, except for Login, Cart, Confirmation
  toPreviousPage = (e, pageIncompleted, prevPage) => {
    e.preventDefault();

    this.setState((prevState) => ({
      arePagesComplete: {
        ...prevState.arePagesComplete,
        [`is${prevPage}Complete`]: false,
        [`is${pageIncompleted}Complete`]: false,
      },
    }));
  };

  // Pass to Login, Shipping
  postalCodeIsValid = (postalCode) => {
    return /[0-9]$/i.test(postalCode) && postalCode.length === 5;
  };

  // Method to validate names of humans & cities:
  // Used on Signup (part of Login), Shipping, Payment
  nameOrCityIsValid = (name) => {
    return (
      /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -.]*$/i.test(name) &&
      name.replace(/\s/g, "").length &&
      name.replace(/\./g, "").length &&
      name.replace(/'/g, "").length &&
      name.replace(/-/g, "").length
    );
  };
  // END UNIVERSAL METHODS

  // SETTERS
  // Pass to Login:
  setAccountEmailAddress = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      accountEmailAddress: value,
    }));
  };

  // Pass to Cart:
  setItemsAndNumberOfItemsInCart = (
    newQuantity,
    selectedItemIndex,
    itemNameCamelCase
  ) => {
    // Update quantity of item w/o removing it:
    if (newQuantity !== undefined) {
      this.setState((prevState) => ({
        ...prevState,
        itemsInCart: prevState.itemsInCart.map((item) =>
          this.state.itemsInCart.indexOf(item) === selectedItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));
      // Update quantity to 0 (this runs when called in deleteItems)
    } else {
      const itemToDelete = this.state.itemsInCart.filter((item) => {
        return item.itemNameCamelCase === itemNameCamelCase;
      })[0];

      const itemToDeleteIndex = this.state.itemsInCart.indexOf(itemToDelete);

      const newNumberOfItemsInCart = this.state.numberOfItemsInCart - 1;
      this.setState((prevState) => ({
        ...prevState,
        // If passed-in itemToDeleteIndex is equal to the index of that item in this.state.itemsInCart array, set the previous state values of that object, but change the quantity to 0. If indices are not equal, then item does not change.
        itemsInCart: prevState.itemsInCart.map((item) =>
          this.state.itemsInCart.indexOf(item) === itemToDeleteIndex
            ? { ...item, quantity: 0 }
            : item
        ),
        numberOfItemsInCart: newNumberOfItemsInCart,
      }));
    }
  };

  // Pass to Cart:
  setDiscountRate = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      discountRate: value,
    }));
  };

  // Pass to Shipping & Payment
  setOrderDetails = (page, key, value) => {
    this.setState((prevState) => ({
      ...prevState,
      [`${page}Details`]: {
        ...prevState[`${page}Details`],
        [key]: value,
      },
    }));
  };

  // Pass to Shipping
  setShippingAndHandling = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      shippingAndHandling: value,
    }));
  };

  // Pass to Shipping
  setDeliveryTime = (value) => {
    this.setState((prevState) => ({
      ...prevState,
      deliveryTime: value,
    }));
  };
  // END SETTERS

  // METHODS FOR CONFIRMATION
  showHideOrderDetails = () => {
    !this.state.isOrderSummaryDisplayed
      ? this.setState({ isOrderSummaryDisplayed: true })
      : this.setState({ isOrderSummaryDisplayed: false });
  };

  render() {
    let {
      isLoginComplete,
      isCartComplete,
      isShippingComplete,
      isPaymentComplete,
    } = this.state.arePagesComplete;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>codeCommerce</h1>
          {isLoginComplete && (
            <Login
              toNextPage={this.toNextPage}
              setAccountEmailAddress={this.setAccountEmailAddress}
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              postalCodeIsValid={this.postalCodeIsValid}
              nameOrCityIsValid={this.nameOrCityIsValid}
            />
          )}
          {!isLoginComplete && isCartComplete && (
            <Cart
              toNextPage={this.toNextPage}
              setItemsAndNumberOfItemsInCart={
                this.setItemsAndNumberOfItemsInCart
              }
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.itemsInCart.length}
              discountRate={this.state.discountRate}
              setDiscountRate={this.setDiscountRate}
            />
          )}
          {isCartComplete && !isShippingComplete && (
            <Shipping
              toNextPage={this.toNextPage}
              toPreviousPage={this.toPreviousPage}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.numberOfItemsInCart}
              discountRate={this.state.discountRate}
              shippingDetails={this.state.shippingDetails}
              setOrderDetails={this.setOrderDetails}
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              shippingAndHandling={this.state.shippingAndHandling}
              setShippingAndHandling={this.setShippingAndHandling}
              setDeliveryTime={this.setDeliveryTime}
              arePagesComplete={this.state.arePagesComplete}
              postalCodeIsValid={this.postalCodeIsValid}
              nameOrCityIsValid={this.nameOrCityIsValid}
            />
          )}
          {!isShippingComplete && !isPaymentComplete && (
            <Payment
              setOrderDetails={this.setOrderDetails}
              nameOrCityIsValid={this.nameOrCityIsValid}
              arePagesComplete={this.state.arePagesComplete}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.numberOfItemsInCart}
              discountRate={this.state.discountRate}
              toNextPage={this.toNextPage}
              toPreviousPage={this.toPreviousPage}
              shippingDetails={this.state.shippingDetails}
              shippingAndHandling={this.state.shippingAndHandling}
              deliveryTime={this.state.deliveryTime}
              accountEmailAddress={this.state.accountEmailAddress}
            />
          )}
          {isPaymentComplete && (
            <Confirmation
              accountEmailAddress={this.state.accountEmailAddress}
              arePagesComplete={this.state.arePagesComplete}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.numberOfItemsInCart}
              discountRate={this.state.discountRate}
              shippingDetails={this.state.shippingDetails}
              cardNumber={this.state.paymentDetails.cardNumber}
              cardType={this.state.paymentDetails.cardType}
              shippingAndHandling={this.state.shippingAndHandling}
              deliveryTime={this.state.deliveryTime}
              isOrderSummaryDisplayed={this.state.isOrderSummaryDisplayed}
              showHideOrderDetails={this.showHideOrderDetails}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
