import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Confirmation from "./Components/Confirmation/Confirmation";
import Login from "./Components/Login/Login";
import Cart from "./Components/Cart/Cart";
import { ITEMS_IN_CART } from "./constants";
import Shipping from "./Components/Shipping/Shipping";
import Payment from "./Components/Payment/Payment";
import { cardImages, cardRegexPatterns } from "./constants";

let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

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

      // State values for Shipping:

      // State values for Payment
      paymentErrors: {
        cardNumberError: "",
        cardHolderError: "",
        expiryError: "",
        securityCodeError: "",
      },
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

  // Pass to Shipping
  setShippingDetails = (key, value) => {
    this.setState((prevState) => ({
      ...prevState,
      shippingDetails: {
        ...prevState.shippingDetails,
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

  // METHODS FOR SHIPPING

  // METHODS FOR PAYMENT
  // If input of card number field matches any RegEx patterns of accepted cards, the card type (AmEx, Visa, etc.) is returned. If not, nothing is returned.
  findDebitCardType = (cardNumber) => {
    for (const cardType in cardRegexPatterns) {
      if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[cardType])) {
        return cardType;
      }
    }
    return "";
  };

  // Method to format AmEx numbers:
  formatAmex(inputNumber) {
    let cleaned = ("" + inputNumber).replace(/\D/g, "");
    let match = cleaned.match(/^(\d{4})(\d{6})(\d{5})$/);
    if (match) {
      return match[1] + " " + match[2] + " " + match[3];
    }
    return null;
  }

  // Check that card number is valid. Return error message if not.
  checkCardNumberError = (cardNumber) => {
    for (const card in cardRegexPatterns) {
      // Remove any empty spaces (chars that are not digits) in card number:
      if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[card])) {
        if (cardNumber) {
          return cardNumber &&
            /^[1-6]{1}[0-9]{14,15}$/i.test(
              cardNumber.replace(/[^\d]/g, "").trim()
            )
            ? ""
            : "Please enter a valid card number";
        }
      }
    }
    return "Please enter a valid card number";
  };

  validateCardNumber = (e) => {
    let value = e.target.value.trim();
    let errorText = this.checkCardNumberError(value);
    let cardType = this.findDebitCardType(value);
    let mask = value.split(" ").join("");
    // If any input...
    if (mask.length) {
      if (cardType === "AMERICAN_EXPRESS") {
        mask = this.formatAmex(value);
      } else {
        // Add space after every fourth character:
        mask = mask.match(new RegExp(".{1,4}", "g")).join(" ");
      }
      // Set appropriate state values:
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          cardNumberMask: mask,
          cardNumber: value.replace(/\s/g, ""),
          cardType: cardType,
          cardImage: cardImages[cardType],
        },
        paymentErrors: {
          ...prevState.paymentErrors,
          cardNumberError: errorText,
        },
      }));
      // If no input, reset appropriate state values:
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          cardNumberMask: "",
          cardNumber: "",
          cardType: "",
          cardImage: "",
        },
        paymentErrors: {
          ...prevState.paymentErrors,
          cardNumberError: "",
        },
      }));
    }
  };

  getExpiryMonth = (e) => {
    let value = e.target.value;
    if (
      (+value <= currentMonth &&
        +this.state.paymentDetails.expiryYear === currentYear) ||
      (+this.state.paymentDetails.expiryYear !== 0 &&
        +this.state.paymentDetails.expiryYear < currentYear)
    ) {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryMonth: value,
        },
        paymentErrors: {
          ...prevState.paymentErrors,
          expiryError: "Invalid date",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryMonth: value,
        },
        paymentErrors: {
          ...prevState.paymentErrors,
          expiryError: "",
        },
      }));
    }
  };

  getExpiryYear = (e) => {
    let value = e.target.value;
    if (
      (+this.state.paymentDetails.expiryMonth !== "" &&
        +this.state.paymentDetails.expiryMonth <= currentMonth &&
        +value === currentYear) ||
      +value < currentYear
    ) {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryYear: value,
        },
        paymentErrors: {
          ...prevState.paymentErrors,
          expiryError: "Invalid date",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryYear: value,
        },
        paymentErrors: {
          ...prevState.paymentErrors,
          expiryError: "",
        },
      }));
    }
  };

  validateCVV = (e) => {
    let value = e.target.value.trim();
    if (/[0-9]$/i.test(value)) {
      this.setState((prevState) => ({
        ...prevState,
        paymentErrors: {
          ...prevState.paymentErrors,
          securityCodeError: "",
        },
        paymentDetails: {
          ...prevState.paymentDetails,
          securityCode: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentErrors: {
          ...prevState.paymentErrors,
          securityCodeError: "3-digit CVV (on card back)",
        },
        paymentDetails: {
          ...prevState.paymentDetails,
          securityCode: value,
        },
      }));
    }
  };

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
          {!isLoginComplete && (
            <Login
              toNextPage={this.toNextPage}
              setAccountEmailAddress={this.setAccountEmailAddress}
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              postalCodeIsValid={this.postalCodeIsValid}
              nameOrCityIsValid={this.nameOrCityIsValid}
            />
          )}
          {isLoginComplete && isCartComplete && (
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
          {!isCartComplete && !isShippingComplete && (
            <Shipping
              toNextPage={this.toNextPage}
              toPreviousPage={this.toPreviousPage}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.numberOfItemsInCart}
              discountRate={this.state.discountRate}
              shippingDetails={this.state.shippingDetails}
              setShippingDetails={this.setShippingDetails}
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              shippingAndHandling={this.state.shippingAndHandling}
              setShippingAndHandling={this.setShippingAndHandling}
              setDeliveryTime={this.setDeliveryTime}
              arePagesComplete={this.state.arePagesComplete}
              postalCodeIsValid={this.postalCodeIsValid}
              nameOrCityIsValid={this.nameOrCityIsValid}
            />
          )}
          {!isShippingComplete && isPaymentComplete && (
            <Payment
              paymentErrors={this.state.paymentErrors}
              arePagesComplete={this.state.arePagesComplete}
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              findDebitCardType={this.findDebitCardType}
              formatAmex={this.formatAmex}
              checkCardNumberError={this.checkCardNumberError}
              validateCardNumber={this.validateCardNumber}
              getExpiryMonth={this.getExpiryMonth}
              getExpiryYear={this.getExpiryYear}
              validateCVV={this.validateCVV}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.numberOfItemsInCart}
              discountRate={this.state.discountRate}
              toNextPage={this.toNextPage}
              toPreviousPage={this.toPreviousPage}
              shippingDetails={this.state.shippingDetails}
              shippingAndHandling={this.state.shippingAndHandling}
              deliveryTime={this.state.deliveryTime}
              paymentDetails={this.state.paymentDetails}
              accountEmailAddress={this.state.accountEmailAddress}
              nameOrCityIsValid={this.nameOrCityIsValid}
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
