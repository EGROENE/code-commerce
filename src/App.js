import React from "react";
import logo from "./new-logo.png";
import "./App.css";

// Imports for Login:
import Login from "./Components/Login/Login";
import loginStyle from "./Components/Login/Login.module.css";
import Confirmation from "./Components/Confirmation/Confirmation";
import { registeredAccounts } from "./constants";

// Imports for Cart:
import Cart from "./Components/Cart/Cart";
import { ITEMS_IN_CART, promoCodes } from "./constants";

// Imports for Shipping:
import Shipping from "./Components/Shipping/Shipping";

// Imports for Payment:
import Payment from "./Components/Payment/Payment";
import { cardImages, cardRegexPatterns } from "./constants";

let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

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

      // LOGIN/SIGNUP STATE VALUES
      accountEmailAddress: "",
      password: "",
      isLoginMethodSelected: true,
      isRequired: false,
      passwordPlaceholder: "Enter your password",
      passwordFieldInputType: "password",
      isOpenEye: true,
      eyeLogo: (
        <i
          id="openEye"
          className={`far fa-eye ${loginStyle.eye}`}
          title="Show Password"
          onClick={this.showHidePassword}
        ></i>
      ),
      loginErrors: {
        signupEmailError: "",
        loginEmailError: "",
        passwordError: "",
        confirmPasswordError: "",
        firstNameError: "",
        lastNameError: "",
        postalCodeError: "",
      },

      // State values for Cart:
      itemsInCart: ITEMS_IN_CART,
      numberOfItemsInCart: ITEMS_IN_CART.length,
      inputPromoCode: "",
      acceptedPromoCode: "",
      discountRate: 0,

      // State values for Shipping:
      shippingErrors: {
        nameError: "",
        streetAddressError: "",
        postalCodeError: "",
        cityError: "",
        phoneNumberError: "",
      },
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

  // METHODS FOR LOGIN
  // Method that hides/reveals content of password fields & changes icon & its title:
  showHidePassword = () => {
    this.state.isOpenEye
      ? this.setState({
          isOpenEye: false,
          eyeLogo: (
            <i
              id="slashedEye"
              className={`far fa-eye-slash ${loginStyle.eye}`}
              title="Hide Password"
              onClick={this.showHidePassword}
            ></i>
          ),
          passwordFieldInputType: "text",
        })
      : this.setState({
          isOpenEye: true,
          eyeLogo: (
            <i
              id="openEye"
              className={`far fa-eye ${loginStyle.eye}`}
              title="Show Password"
              onClick={this.showHidePassword}
            ></i>
          ),
          passwordFieldInputType: "password",
        });
  };

  // Call the method below to return the email address associated w/ the input password
  getRegisteredAccount = (email) => {
    return registeredAccounts.find((account) => account.email === email);
  };

  // Validate email address:
  validateEmailSignup = (e) => {
    let value = e.target.value.trim();
    let userAccount = this.getRegisteredAccount(value);
    if (userAccount) {
      this.setState((prevState) => ({
        accountEmailAddress: value,
        loginErrors: {
          ...prevState.loginErrors,
          signupEmailError: "E-mail address already in use",
        },
      }));
    } else if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value.trim()
      )
    ) {
      // Update email error state value to "". Will need to access previous state values.
      this.setState((prevState) => ({
        accountEmailAddress: value,
        loginErrors: {
          ...prevState.loginErrors,
          signupEmailError: "",
          loginEmailError: "",
        },
      }));
    } else {
      // Update email error state value to an error message. Will need to access previous state values.
      this.setState((prevState) => ({
        loginErrors: {
          accountEmailAddress: "",
          ...prevState.loginErrors,
          signupEmailError: "Please enter a valid email address",
        },
      }));
    }
  };

  validateEmailLogin = (e) => {
    let value = e.target.value.trim();
    let registeredAccount = this.getRegisteredAccount(value);
    if (registeredAccount) {
      this.setState((prevState) => ({
        accountEmailAddress: value,
        loginErrors: {
          ...prevState.loginErrors,
          signupEmailError: "",
          loginEmailError: "",
        },
      }));
    } else {
      // Update email error state value to an error message. Will need to access previous state values.
      this.setState((prevState) => ({
        loginErrors: {
          accountEmailAddress: "",
          ...prevState.loginErrors,
          loginEmailError: "E-mail address not recognized",
        },
      }));
    }
  };

  // Validate password on signup:
  validatePasswordSignup = (e) => {
    let value = e.target.value.trim();
    if (
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/.test(
        value.trim()
      )
    ) {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          passwordError: "",
        },
        password: value,
      }));
    } else {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          passwordError:
            "Password must contain >= 1 uppercase & 1 lowercase English letter, >= 1 digit, >= 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
        },
        password: "",
      }));
    }
  };

  // Validate passwords:
  validatePasswordConfirmation = (e) => {
    let value = e.target.value.trim();
    if (this.state.password !== value) {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          confirmPasswordError: "Passwords do not match",
        },
      }));
    } else {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          confirmPasswordError: "",
        },
      }));
    }
  };

  validatePasswordLogin = (e) => {
    let value = e.target.value.trim();
    let userAccount = this.getRegisteredAccount(this.state.accountEmailAddress);
    if (userAccount && userAccount.password === value) {
      this.setState((prevState) => ({
        ...prevState,
        password: value,
        loginErrors: {
          ...prevState.loginErrors,
          passwordError: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        loginErrors: {
          ...prevState.loginErrors,
          passwordError:
            "Password doesn't match account with this e-mail address",
        },
      }));
    }
  };

  // Also use on Shipping
  validatePostalCode = (e, formType) => {
    let value = e.target.value.trim();
    if (formType === "shipping") {
      this.setState((prevState) => ({
        ...prevState,
        shippingDetails: {
          ...prevState.shippingDetails,
          postalCode: value,
        },
      }));
    }
    if (/[0-9]$/i.test(value)) {
      this.setState((prevState) => ({
        ...prevState,
        [`${formType}Errors`]: {
          ...prevState[`${formType}Errors`],
          postalCodeError: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        [`${formType}Errors`]: {
          ...prevState[`${formType}Errors`],
          postalCodeError: "5-digit US postal code",
        },
      }));
    }
  };

  clearLoginErrors = () => {
    this.setState((prevState) => ({
      ...prevState,
      loginErrors: {
        signupEmailError: "",
        loginEmailError: "",
        passwordError: "",
        confirmPasswordError: "",
        nameError: "",
        postalCodeError: "",
      },
    }));
  };

  selectLoginMethod = (e) => {
    this.clearLoginErrors();
    if (!this.state.isOpenEye) {
      this.showHidePassword();
    }
    e.target.id === "logIn"
      ? this.setState({
          isLoginMethodSelected: true,
          passwordPlaceholder: "Enter your password",
          isRequired: false,
          signupEmailFieldValue: "",
          loginEmailFieldValue: undefined,
          loginPasswordValue: undefined,
        })
      : this.setState({
          isLoginMethodSelected: false,
          passwordPlaceholder: "Create a password",
          isRequired: true,
          signupEmailFieldValue: undefined,
          loginEmailFieldValue: "",
          loginPasswordValue: "",
        });
  };

  // METHODS FOR CART
  updateQuantities = (e, itemNameCamelCase) => {
    let newQuantity = Number(e.target.value.trim());
    let selectedItem = this.state.itemsInCart.filter((item) => {
      return item.itemNameCamelCase === itemNameCamelCase;
    })[0];

    let selectedItemIndex = this.state.itemsInCart.indexOf(selectedItem);

    // Prevent user from manually entering '0' or backspacing and deleting item quantities:
    if (newQuantity !== "" && newQuantity !== 0) {
      this.setState((prevState) => ({
        ...prevState,
        itemsInCart: prevState.itemsInCart.map((item) =>
          this.state.itemsInCart.indexOf(item) === selectedItemIndex
            ? { ...item, quantity: newQuantity }
            : item
        ),
      }));
    }
  };

  // Method to delete item from cart:
  deleteItem = (e, itemNameCamelCase) => {
    let itemToDelete = this.state.itemsInCart.filter((item) => {
      return item.itemNameCamelCase === itemNameCamelCase;
    })[0];

    let itemToDeleteIndex = this.state.itemsInCart.indexOf(itemToDelete);

    let numberOfItemsInCart = this.state.numberOfItemsInCart - 1;

    this.setState((prevState) => ({
      ...prevState,
      // If passed-in itemToDeleteIndex is equal to the index of that item in this.state.itemsInCart array, set the previous state values of that object, but change the quantity to 0. If indices are not equal, then item does not change.
      itemsInCart: prevState.itemsInCart.map((item) =>
        this.state.itemsInCart.indexOf(item) === itemToDeleteIndex
          ? { ...item, quantity: 0 }
          : item
      ),
      numberOfItemsInCart: numberOfItemsInCart,
    }));
  };

  // Method that checks if all item.quantities are zero (no items in cart)
  isCartEmpty = () => {
    let allItemQuantities = this.state.itemsInCart.map((item) => item.quantity);
    return allItemQuantities.some((quantity) => quantity > 0) ? false : true;
  };

  // Set state value inputPromoCode to what user inputs:
  getPromoCode = (e) => {
    let inputCode = e.target.value.trim().toLowerCase();
    this.setState((prevState) => ({
      ...prevState,
      inputPromoCode: inputCode,
    }));
  };

  // Check input promo code to see if it matches an available promo, then apply appropriate discount:
  checkPromoCode = () => {
    let inputPromoCode = this.state.inputPromoCode;
    if (promoCodes.includes(inputPromoCode)) {
      if (inputPromoCode === "ilikebeachballs") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.1,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "codeislyfe") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.25,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "devslopes") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.5,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "jd911") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.75,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "etlb17") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.99,
          isInvalidPromo: false,
        }));
      }
    } else {
      this.setState((prevState) => ({
        ...prevState,
        discountRate: 0,
        isInvalidPromo: true,
      }));
    }
  };

  // Method to remove discount:
  removeDiscount = () => {
    this.setState((prevState) => ({
      ...prevState,
      discountRate: 0,
      isInvalidPromo: false,
    }));
  };

  // METHODS FOR SHIPPING
  // Method to set state values of dropdown fields (initially, at least, 'title' & 'state/territory'):
  setStateValuesOfDropdownFields = (e) => {
    let value = e.target.value;
    let field = e.target.id;
    this.setState((prevState) => ({
      ...prevState,
      shippingDetails: {
        ...prevState.shippingDetails,
        [field]: value,
      },
    }));
  };

  // Method to validate names of humans & cities:
  // Used on Signup, Shipping
  validateNamesAndCityNames = (e, field, page) => {
    let value = e.target.value;
    if (
      /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -.]*$/i.test(value) &&
      value.replace(/\s/g, "").length
    ) {
      this.setState((prevState) => ({
        ...prevState,
        [`${page}Errors`]: {
          ...prevState[`${page}Errors`],
          [`${field}Error`]: "",
        },
        [`${page}Details`]: {
          ...prevState[`${page}Details`],
          [field]: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        [`${page}Errors`]: {
          ...prevState[`${page}Errors`],
          [`${field}Error`]:
            "Enter alphabetical characters & any spaces between words",
        },
        [`${page}Details`]: {
          ...prevState[`${page}Details`],
          [field]: value,
        },
      }));
    }
  };

  // Method to validate street address:
  validateStreetAddress = (e) => {
    let value = e.target.value;
    if (/[A-Z0-9#/ '-]+/i.test(value) && value.replace(/\s/g, "").length) {
      this.setState((prevState) => ({
        ...prevState,
        shippingErrors: {
          ...prevState.shippingErrors,
          streetAddress: "",
        },
        shippingDetails: {
          ...prevState.shippingDetails,
          streetAddress: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        shippingErrors: {
          ...prevState.shippingErrors,
          streetAddress: "Please enter a valid address",
        },
        shippingDetails: {
          ...prevState.shippingDetails,
          streetAddress: value,
        },
      }));
    }
  };

  formatPhoneNumber(phoneNumberString) {
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return undefined;
  }

  // Method to validate phone number:
  validatePhoneNumber = (e) => {
    let value = e.target.value.trim();
    let phoneNumberMask = this.formatPhoneNumber(value);
    if (/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i.test(value)) {
      this.setState((prevState) => ({
        ...prevState,
        shippingErrors: {
          ...prevState.shippingErrors,
          phoneNumber: "",
        },
        shippingDetails: {
          ...prevState.shippingDetails,
          phoneNumber: value.replace(/[^\d]/g, ""),
          phoneNumberMask: phoneNumberMask,
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        shippingErrors: {
          ...prevState.shippingErrors,
          phoneNumber: "Enter 10-digit, US number",
        },
        shippingDetails: {
          ...prevState.shippingDetails,
          phoneNumber: "",
          phoneNumberMask: phoneNumberMask,
        },
      }));
    }
  };

  // Method to update shipping & handling state value:
  handleDeliveryOptionSelection = (e) => {
    if (e.target.id === "expeditedDelivery") {
      this.setState((prevState) => ({
        ...prevState,
        shippingAndHandling: 50,
        deliveryTime: "3 seconds",
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        shippingAndHandling: 10,
        deliveryTime: "3 days",
      }));
    }
  };

  // METHODS FOR PAYMENT
  // Validation methods:
  validateCardHolderName = (e) => {
    let value = e.target.value;
    if (
      /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value) &&
      value.replace(/\s/g, "").length
    ) {
      this.setState((prevState) => ({
        ...prevState,
        paymentErrors: {
          ...prevState.paymentErrors,
          cardHolderError: "",
        },
        paymentDetails: {
          ...prevState.paymentDetails,
          cardHolder: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentErrors: {
          ...prevState.paymentErrors,
          cardHolderError: "Enter only alphabetic characters (and any hyphens)",
        },
        paymentDetails: {
          ...prevState.paymentDetails,
          cardHolder: value,
        },
      }));
    }
  };

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
              loginErrors={this.state.loginErrors}
              toNextPage={this.toNextPage}
              isLoginMethodSelected={this.state.isLoginMethodSelected}
              isRequired={this.state.isRequired}
              passwordPlaceholder={this.state.passwordPlaceholder}
              passwordFieldInputType={this.state.passwordFieldInputType}
              eyeLogo={this.state.eyeLogo}
              signupEmailFieldValue={this.state.signupEmailFieldValue}
              loginEmailFieldValue={this.state.loginEmailFieldValue}
              loginPasswordValue={this.state.loginPasswordValue}
              selectLoginMethod={this.selectLoginMethod}
              getRegisteredAccount={this.getRegisteredAccount}
              validateEmailSignup={this.validateEmailSignup}
              validateEmailLogin={this.validateEmailLogin}
              validatePasswordSignup={this.validatePasswordSignup}
              validatePasswordConfirmation={this.validatePasswordConfirmation}
              validatePasswordLogin={this.validatePasswordLogin}
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              validatePostalCode={this.validatePostalCode}
              clearLoginErrors={this.clearLoginErrors}
            />
          )}
          {isLoginComplete && !isCartComplete && (
            <Cart
              toNextPage={this.toNextPage}
              updateQuantities={this.updateQuantities}
              deleteItem={this.deleteItem}
              isCartEmpty={this.isCartEmpty}
              getPromoCode={this.getPromoCode}
              checkPromoCode={this.checkPromoCode}
              removeDiscount={this.removeDiscount}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.itemsInCart.length}
              discountRate={this.state.discountRate}
              isInvalidPromo={this.state.isInvalidPromo}
              acceptedPromoCode={this.state.acceptedPromoCode}
            />
          )}
          {isCartComplete && !isShippingComplete && (
            <Shipping
              toNextPage={this.toNextPage}
              toPreviousPage={this.toPreviousPage}
              validatePostalCode={this.validatePostalCode}
              setStateValuesOfDropdownFields={
                this.setStateValuesOfDropdownFields
              }
              validateNamesAndCityNames={this.validateNamesAndCityNames}
              validateStreetAddress={this.validateStreetAddress}
              formatPhoneNumber={this.formatPhoneNumber}
              validatePhoneNumber={this.validatePhoneNumber}
              handleDeliveryOptionSelection={this.handleDeliveryOptionSelection}
              shippingErrors={this.state.shippingErrors}
              shippingAndHandling={this.state.shippingAndHandling}
              deliveryTime={this.state.deliveryTime}
              shippingDetails={this.state.shippingDetails}
              discountRate={this.state.discountRate}
              itemsInCart={this.state.itemsInCart}
              numberOfItemsInCart={this.state.numberOfItemsInCart}
              arePagesComplete={this.state.arePagesComplete}
            />
          )}
          {isShippingComplete && !isPaymentComplete && (
            <Payment
              paymentErrors={this.state.paymentErrors}
              arePagesComplete={this.state.arePagesComplete}
              validateCardHolderName={this.validateCardHolderName}
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
