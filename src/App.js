import React from "react";
import logo from "./new-logo.png";
import "./App.css";

// Child components:
import ClassLogin from "./Components/Login/ClassLogin";
import FunctionalLogin from "./Components/Login/FunctionalLogin";
import ClassCart from "./Components/Cart/ClassCart";
import FunctionalCart from "./Components/Cart/FunctionalCart";
import ClassShipping from "./Components/Shipping/ClassShipping";
import FunctionalShipping from "./Components/Shipping/FunctionalShipping";
import ClassPayment from "./Components/Payment/ClassPayment";
import FunctionalPayment from "./Components/Payment/FunctionalPayment";
import ClassConfirmation from "./Components/Confirmation/ClassConfirmation";
import FunctionalConfirmation from "./Components/Confirmation/FunctionalConfirmation";

// Constants & methods:
import { ITEMS_IN_CART } from "./constants";
import { alertFormErrors } from "./methods";

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
      // Define here so data can be passed to child props
      loginData: {
        accountEmail: "",
        password: "",
        confirmationPassword: "",
        firstName: "",
        lastName: "",
        postalCode: "",
      },
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
      hasFailedSubmission: false,
    };
  }

  // UNIVERSAL METHODS
  // Method to move to next page:
  // Pass this as prop to children, except for Confirmation
  toNextPage = (e, pageCompleted) => {
    e.preventDefault();

    this.setState((prevState) => ({
      ...prevState,
      hasFailedSubmission: false,
      arePagesComplete: {
        ...prevState.arePagesComplete,
        [`is${pageCompleted}Complete`]: true,
      },
    }));
  };

  handleRejection = () => {
    this.setState((prevState) => ({
      ...prevState,
      hasFailedSubmission: true,
    }));
    alertFormErrors();
  };

  // Method to go to previous page:
  // Pass this as prop to children, except for Login, Cart, Confirmation
  toPreviousPage = (e, pageIncompleted, prevPage) => {
    e.preventDefault();

    this.setState((prevState) => ({
      ...prevState,
      arePagesComplete: {
        ...prevState.arePagesComplete,
        [`is${prevPage}Complete`]: false,
        [`is${pageIncompleted}Complete`]: false,
      },
    }));
  };
  // END UNIVERSAL METHODS

  // SETTERS

  // Call onClick of version-selection buttons:
  handleVersionSelection = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      userHasSelectedVersion: true,
    }));
    const version = e.target.id;
    if (version === "classVersion") {
      this.setState((prevState) => ({
        ...prevState,
        classVersionIsSelected: true,
      }));
    }
  };

  // Pass to Login:
  setLoginData = (key, value) => {
    this.setState((prevState) => ({
      ...prevState,
      loginData: {
        ...prevState.loginData,
        [`${key}`]: value,
      },
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

  render() {
    const {
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
          {!this.state.userHasSelectedVersion && (
            <div id="selectVersionContainer">
              <h2>Please select app version to use:</h2>
              <div>
                <button onClick={this.handleVersionSelection} id="classVersion">
                  Class Version
                </button>
                <button
                  onClick={this.handleVersionSelection}
                  id="functionalVersion"
                >
                  Functional Version
                </button>
              </div>
            </div>
          )}
          {!isLoginComplete &&
            this.state.userHasSelectedVersion &&
            (this.state.classVersionIsSelected ? (
              <ClassLogin
                handleRejection={this.handleRejection}
                hasFailedSubmission={this.state.hasFailedSubmission}
                toNextPage={this.toNextPage}
                loginData={this.state.loginData}
                setLoginData={this.setLoginData}
              />
            ) : (
              <FunctionalLogin
                handleRejection={this.handleRejection}
                hasFailedSubmission={this.state.hasFailedSubmission}
                toNextPage={this.toNextPage}
                loginData={this.state.loginData}
                setLoginData={this.setLoginData}
              />
            ))}
          {isLoginComplete &&
            !isCartComplete &&
            (this.state.classVersionIsSelected ? (
              <ClassCart
                toNextPage={this.toNextPage}
                setItemsAndNumberOfItemsInCart={
                  this.setItemsAndNumberOfItemsInCart
                }
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.itemsInCart.length}
                discountRate={this.state.discountRate}
                setDiscountRate={this.setDiscountRate}
              />
            ) : (
              <FunctionalCart
                toNextPage={this.toNextPage}
                setItemsAndNumberOfItemsInCart={
                  this.setItemsAndNumberOfItemsInCart
                }
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.itemsInCart.length}
                discountRate={this.state.discountRate}
                setDiscountRate={this.setDiscountRate}
              />
            ))}
          {isCartComplete &&
            !isShippingComplete &&
            (this.state.classVersionIsSelected ? (
              <ClassShipping
                handleRejection={this.handleRejection}
                hasFailedSubmission={this.state.hasFailedSubmission}
                toPreviousPage={this.toPreviousPage}
                toNextPage={this.toNextPage}
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.numberOfItemsInCart}
                discountRate={this.state.discountRate}
                shippingDetails={this.state.shippingDetails}
                setOrderDetails={this.setOrderDetails}
                shippingAndHandling={this.state.shippingAndHandling}
                setShippingAndHandling={this.setShippingAndHandling}
                setDeliveryTime={this.setDeliveryTime}
                arePagesComplete={this.state.arePagesComplete}
              />
            ) : (
              <FunctionalShipping
                handleRejection={this.handleRejection}
                hasFailedSubmission={this.state.hasFailedSubmission}
                toPreviousPage={this.toPreviousPage}
                toNextPage={this.toNextPage}
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.numberOfItemsInCart}
                discountRate={this.state.discountRate}
                shippingDetails={this.state.shippingDetails}
                setOrderDetails={this.setOrderDetails}
                shippingAndHandling={this.state.shippingAndHandling}
                setShippingAndHandling={this.setShippingAndHandling}
                setDeliveryTime={this.setDeliveryTime}
                arePagesComplete={this.state.arePagesComplete}
              />
            ))}
          {isShippingComplete &&
            !isPaymentComplete &&
            (this.state.classVersionIsSelected ? (
              <ClassPayment
                handleRejection={this.handleRejection}
                hasFailedSubmission={this.state.hasFailedSubmission}
                setOrderDetails={this.setOrderDetails}
                arePagesComplete={this.state.arePagesComplete}
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.numberOfItemsInCart}
                discountRate={this.state.discountRate}
                toNextPage={this.toNextPage}
                toPreviousPage={this.toPreviousPage}
                shippingDetails={this.state.shippingDetails}
                shippingAndHandling={this.state.shippingAndHandling}
                deliveryTime={this.state.deliveryTime}
                accountEmail={this.state.accountEmail}
                paymentDetails={this.state.paymentDetails}
              />
            ) : (
              <FunctionalPayment
                handleRejection={this.handleRejection}
                hasFailedSubmission={this.state.hasFailedSubmission}
                setOrderDetails={this.setOrderDetails}
                arePagesComplete={this.state.arePagesComplete}
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.numberOfItemsInCart}
                discountRate={this.state.discountRate}
                toNextPage={this.toNextPage}
                toPreviousPage={this.toPreviousPage}
                shippingDetails={this.state.shippingDetails}
                shippingAndHandling={this.state.shippingAndHandling}
                deliveryTime={this.state.deliveryTime}
                accountEmail={this.state.accountEmail}
                paymentDetails={this.state.paymentDetails}
              />
            ))}
          {isPaymentComplete &&
            (this.state.classVersionIsSelected ? (
              <ClassConfirmation
                accountEmail={this.state.loginData.accountEmail}
                arePagesComplete={this.state.arePagesComplete}
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.numberOfItemsInCart}
                discountRate={this.state.discountRate}
                shippingDetails={this.state.shippingDetails}
                cardNumber={this.state.paymentDetails.cardNumber}
                cardType={this.state.paymentDetails.cardType}
                shippingAndHandling={this.state.shippingAndHandling}
                deliveryTime={this.state.deliveryTime}
              />
            ) : (
              <FunctionalConfirmation
                accountEmail={this.state.loginData.accountEmail}
                arePagesComplete={this.state.arePagesComplete}
                itemsInCart={this.state.itemsInCart}
                numberOfItemsInCart={this.state.numberOfItemsInCart}
                discountRate={this.state.discountRate}
                shippingDetails={this.state.shippingDetails}
                cardNumber={this.state.paymentDetails.cardNumber}
                cardType={this.state.paymentDetails.cardType}
                shippingAndHandling={this.state.shippingAndHandling}
                deliveryTime={this.state.deliveryTime}
              />
            ))}
        </header>
      </div>
    );
  }
}

export default App;
