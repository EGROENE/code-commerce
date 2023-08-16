import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Login from "./Components/Login/Login";
import loginStyle from "./Components/Login/Login.module.css";
import Cart from "./Components/Cart/Cart";
import Shipping from "./Components/Shipping/Shipping";
import Payment from "./Components/Payment/Payment";
import Confirmation from "./Components/Confirmation/Confirmation";
import { registeredAccounts } from "./constants";

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
        nameError: "",
        postalCodeError: "",
      },
    };
  }

  // Method to move to next page:
  // Pass this as prop to children, except for Confirmation
  toNextPage = (e, pageCompleted) => {
    e.preventDefault();

    this.setState((prevState) => ({
      arePagesComplete: {
        ...prevState.arePagesComplete,
        [`is${pageCompleted}Complete`]: true,
      },
    }));
  };

  // Method to go to previous page:
  // Pass this as prop to children, except for Login, Cart, Confirmation
  toPreviousPage = (e, pageIncompleted) => {
    e.preventDefault();

    this.setState((prevState) => ({
      arePagesComplete: {
        ...prevState.arePagesComplete,
        [`is${pageIncompleted.toUpperCase()}Complete`]: false,
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

  // Validate name:
  validateNames = (e) => {
    let value = e.target.value.trim();
    if (/^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value)) {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          nameError: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          nameError: "Enter only alphabetic characters & any hyphens b/t names",
        },
      }));
    }
  };

  validatePostalCode = (e) => {
    let value = e.target.value.trim();
    if (/[0-9]$/i.test(value)) {
      this.setState((prevState) => ({
        loginErrors: {
          ...prevState.loginErrors,
          postalCodeError: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCodeError: "Enter first 5 digits of US postal code",
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
              validateNames={this.validateNames}
              validatePostalCode={this.validatePostalCode}
              clearLoginErrors={this.clearLoginErrors}
            />
          )}
          {isLoginComplete && <Cart />}
          {isCartComplete && <Shipping />}
          {isShippingComplete && <Payment />}
          {isPaymentComplete && (
            <Confirmation
              accountEmailAddress={this.state.accountEmailAddress}
            />
          )}
        </header>
      </div>
    );
  }
}

export default App;
