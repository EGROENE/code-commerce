import React from "react";
import style from "./Login.module.css";
import Cart from "../Cart/Cart";
import { alertFormErrors } from "../../methods";
import { registeredAccounts } from "../../constants";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginMethodSelected: true,
      accountEmailAddress: "",
      passwordPlaceholder: "Enter your password",
      passwordFieldInputType: "password",
      isOpenEye: true,
      eyeLogo: (
        <i
          id="openEye"
          className={`far fa-eye ${style.eye}`}
          title="Show Password"
          onClick={this.showHidePassword}
        ></i>
      ),
      // Object containing error message for each form field:
      errors: {
        signupEmailError: "",
        loginEmailError: "",
        passwordError: "",
        confirmPasswordError: "",
        nameError: "",
        postalCodeError: "",
      },
      password: "",
      isRequired: false,
    };
  }

  clearErrors = () => {
    this.setState((prevState) => ({
      ...prevState,
      errors: {
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
    this.clearErrors();
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

  // Method that hides/reveals content of password fields & changes icon & its title:
  showHidePassword = () => {
    this.state.isOpenEye
      ? this.setState({
          isOpenEye: false,
          eyeLogo: (
            <i
              id="slashedEye"
              className={`far fa-eye-slash ${style.eye}`}
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
              className={`far fa-eye ${style.eye}`}
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
        errors: {
          accountEmailAddress: value,
          ...prevState.errors,
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
        errors: {
          ...prevState.errors,
          signupEmailError: "",
          loginEmailError: "",
        },
      }));
    } else {
      // Update email error state value to an error message. Will need to access previous state values.
      this.setState((prevState) => ({
        errors: {
          accountEmailAddress: "",
          ...prevState.errors,
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
        errors: {
          ...prevState.errors,
          signupEmailError: "",
          loginEmailError: "",
        },
      }));
    } else {
      // Update email error state value to an error message. Will need to access previous state values.
      this.setState((prevState) => ({
        errors: {
          accountEmailAddress: "",
          ...prevState.errors,
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
        errors: {
          ...prevState.errors,
          passwordError: "",
        },
        password: value,
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          passwordError:
            "Password must contain >= 1 uppercase & 1 lowercase English letter, >= 1 digit, >= 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
        },
        password: "",
      }));
    }
  };

  // Validate password confirmation:
  validatePasswordConfirmation = (e) => {
    let value = e.target.value.trim();
    if (this.state.password !== value) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          confirmPasswordError: "Passwords do not match",
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
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
        errors: {
          ...prevState.errors,
          passwordError: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        errors: {
          ...prevState.errors,
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
        errors: {
          ...prevState.errors,
          nameError: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          nameError: "Enter only alphabetic characters & any hyphens b/t names",
        },
      }));
    }
  };

  // Validate postal code:
  validatePostalCode = (e) => {
    let value = e.target.value.trim();
    if (/[0-9]$/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
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

  render() {
    // Destructure props:
    const {
      isLoginHidden,
      toNextPage,
      isCartHidden,
      isShippingHidden,
      isPaymentHidden,
      isConfirmationHidden,
      toPreviousPage,
      completedPages,
    } = this.props;

    // Destructure state:
    const {
      isLoginMethodSelected,
      eyeLogo,
      passwordFieldInputType,
      passwordPlaceholder,
      errors,
      isRequired,
      accountEmailAddress,
      signupEmailFieldValue,
      loginEmailFieldValue,
      loginPasswordValue,
    } = this.state;

    const loginMethodHeaders = [
      {
        id: "logIn",
        className: isLoginMethodSelected ? style.selected : style.unselected,
        textContent: "Log In",
      },
      {
        id: "signUp",
        className: !isLoginMethodSelected ? style.selected : style.unselected,
        textContent: "Sign Up",
      },
    ];

    const formInputs = [
      {
        id: "signupEmail",
        isHidden: isLoginMethodSelected,
        labelText: "Email Address:",
        placeholder: "E-mail address",
        inputType: "signupEmail",
        onChange: this.validateEmailSignup,
        field: "signupEmail",
        required: !isLoginMethodSelected,
        inputMode: "email",
        autoComplete: "email",
        value: signupEmailFieldValue,
      },
      {
        id: "loginEmail",
        isHidden: !isLoginMethodSelected,
        labelText: "Email Address:",
        placeholder: "E-mail address",
        inputType: "email",
        onChange: this.validateEmailLogin,
        field: "loginEmail",
        required: isLoginMethodSelected,
        inputMode: "email",
        autoComplete: "email",
        value: loginEmailFieldValue,
      },
      {
        id: "signupPassword",
        isHidden: isLoginMethodSelected,
        labelText: "Password:",
        placeholder: passwordPlaceholder,
        inputType: passwordFieldInputType,
        onChange: this.validatePasswordSignup,
        field: "password",
        required: !isLoginMethodSelected,
        inputMode: "password",
      },
      {
        id: "signupConfirmPassword",
        isHidden: isLoginMethodSelected,
        labelText: "Confirm Password:",
        placeholder: "Confirm Password",
        inputType: passwordFieldInputType,
        onChange: this.validatePasswordConfirmation,
        field: "confirmPassword",
        required: isRequired,
        inputMode: "password",
        autoComplete: "off",
      },
      {
        id: "loginPassword",
        isHidden: !isLoginMethodSelected,
        labelText: "Password:",
        placeholder: passwordPlaceholder,
        inputType: passwordFieldInputType,
        onChange: this.validatePasswordLogin,
        field: "password",
        required: isLoginMethodSelected,
        inputMode: "password",
        autoComplete: "current-password",
        value: loginPasswordValue,
      },
      {
        id: "loginFirstName",
        isHidden: isLoginMethodSelected,
        labelText: "First Name:",
        placeholder: "Enter first name",
        inputType: "text",
        onChange: this.validateNames,
        field: "name",
        required: isRequired,
        inputMode: "text",
        autoComplete: "given-name",
      },
      {
        id: "loginLastName",
        isHidden: isLoginMethodSelected,
        labelText: "Last Name:",
        placeholder: "Enter last name",
        inputType: "text",
        onChange: this.validateNames,
        field: "name",
        required: isRequired,
        inputMode: "text",
        autoComplete: "family-name",
      },
      {
        id: "loginPostalCode",
        isHidden: isLoginMethodSelected,
        labelText: "Postal Code:",
        placeholder: "5-digit US ZIP",
        inputType: "text",
        onChange: this.validatePostalCode,
        field: "postalCode",
        required: isRequired,
        inputMode: "numeric",
        autoComplete: "postal-code",
      },
    ];

    let areNoErrors = Object.values(this.state.errors).every(
      (element) => element === ""
    );

    return (
      <div id="loginAndCart">
        <div hidden={isLoginHidden} id="homepageContainer">
          <header className="pageHeader">Welcome to codeCommerce!</header>
          <div id={style.homepageOptions}>
            {loginMethodHeaders.map((option) => (
              <header
                key={option.id}
                id={option.id}
                className={option.className}
                onClick={this.selectLoginMethod}
              >
                {option.textContent}
              </header>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              toNextPage(e, "isLoginHidden", "isCartHidden");
            }}
          >
            {formInputs.map((input) => (
              <label key={input.labelText} hidden={input.isHidden}>
                <header key={input.labelText + "1"}>{input.labelText}</header>
                <div className="inputFieldWithImage">
                  {input.labelText.includes("Password") && eyeLogo}
                  <input
                    id={input.id}
                    key={input.labelText + "2"}
                    placeholder={input.placeholder}
                    type={
                      input.labelText.includes("Password")
                        ? passwordFieldInputType
                        : input.inputType
                    }
                    onChange={input.onChange}
                    required={input.required}
                    inputMode={input.inputMode}
                    minLength={
                      input.labelText === "Postal Code:" ? 5 : undefined
                    }
                    maxLength={
                      input.labelText === "Postal Code:" ? 5 : undefined
                    }
                    autoComplete={input.autoComplete}
                    value={input.value}
                  />
                </div>
                {input.labelText === "Password:" && !isLoginMethodSelected ? (
                  <p>
                    Must contain at least 1 uppercase & 1 lowercase English
                    letter, at least 1 digit, at least 1 special character (#,
                    ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long
                  </p>
                ) : (
                  <p>{errors[`${input.field}Error`]}</p>
                )}
              </label>
            ))}
            <div id={style.loginBtnsContainer}>
              <button
                type={!areNoErrors ? "button" : "submit"}
                onClick={!areNoErrors ? alertFormErrors : undefined}
              >
                {isLoginMethodSelected ? "Log In" : "Create Account"}
              </button>
              <p>or</p>
              <button id={style.facebookLogin}>
                <i className="fab fa-facebook-f"></i>Log in with Facebook
              </button>
              <div id={style.termsLinksContainer}>
                <p
                  title="Read about our Privacy Policy & how we use cookies"
                  className={style.termsAndConditionsLinks}
                >
                  Privacy Policy & Cookies
                </p>
                <p
                  title="Read our Terms of Sale & Use"
                  className={style.termsAndConditionsLinks}
                >
                  Terms of Sale & Use
                </p>
              </div>
            </div>
          </form>
        </div>
        <Cart
          accountEmailAddress={accountEmailAddress}
          isCartHidden={isCartHidden}
          isShippingHidden={isShippingHidden}
          isPaymentHidden={isPaymentHidden}
          isConfirmationHidden={isConfirmationHidden}
          toNextPage={toNextPage}
          toPreviousPage={toPreviousPage}
          completedPages={completedPages}
        />
      </div>
    );
  }
}

export default Login;
