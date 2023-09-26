import React from "react";
import style from "./Login.module.css";
import { alertFormErrors } from "../../methods";
import loginStyle from "./Login.module.css";
import { registeredAccounts } from "../../constants";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      password: "",
      confirmationPassword: "",
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
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        firstNameError: "",
        lastNameError: "",
        postalCodeError: "",
      },
    };
  }

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

  clearLoginErrors = () => {
    this.setState((prevState) => ({
      ...prevState,
      loginErrors: {
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        nameError: "",
        postalCodeError: "",
      },
    }));
  };

  userSelectsLogin = () => {
    this.setState({
      isLoginMethodSelected: true,
      passwordPlaceholder: "Enter your password",
      isRequired: false,
    });
  };

  userSelectsSignUp = () => {
    this.setState({
      isLoginMethodSelected: false,
      passwordPlaceholder: "Create a password",
      isRequired: true,
    });
  };

  selectLoginMethod = (e) => {
    this.clearLoginErrors();
    if (!this.state.isOpenEye) {
      this.showHidePassword();
    }
    e.target.id === "logIn"
      ? this.userSelectsLogin()
      : this.userSelectsSignUp();
  };

  // Call the method below to return the account associated w/ the input email address
  getRegisteredAccount = (email) => {
    return registeredAccounts.find((account) => account.email === email);
  };

  passwordExists = (password) => {
    return registeredAccounts
      .map((account) => account.password)
      .includes(password);
  };

  // Validate password on signup:
  // Run onChange of initial PW field in signup
  validatePasswordOnSignup = (e) => {
    const value = e.target.value.trim();
    // If value meets requirements for password:
    if (
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/.test(
        value
      )
    ) {
      // If value matches the state value of confirmation password (added onChange of confirm PW field):
      // Causes confirm PW error message to disappear if input value of init pw field matches value of confirm PW field
      if (this.state.confirmationPassword === value) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "",
            confirmPasswordError: "",
          },
          password: value,
        }));
        // If confirm PW field has a value that doesn't equal input value of initial PW field:
        // Causes confirm pw error to appear if value of init pw field (being changed by this method) doesn't match value of confirm pw field, if it exists
      } else if (
        this.state.confirmationPassword.length &&
        this.state.confirmationPassword !== value
      ) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "",
            confirmPasswordError: "Passwords do not match",
          },
          password: value,
        }));
      }
      // If input value of initial PW field doesn't meet PW requirements:
    } else {
      this.setState((prevState) => ({
        ...prevState,
        loginErrors: {
          ...prevState.loginErrors,
          passwordError:
            "Password must contain >= 1 uppercase & 1 lowercase English letter, >= 1 digit, >= 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
        },
        password: value,
      }));
    }
  };

  // Check that value of PW confirmation field matches value of initial PW field
  // Run onChange of PW confirmation input in signup
  validatePasswordConfirmation = (e) => {
    const value = e.target.value.trim();
    if (this.state.password !== value) {
      this.setState((prevState) => ({
        ...prevState,
        confirmationPassword: value,
        loginErrors: {
          ...prevState.loginErrors,
          confirmPasswordError: "Passwords do not match",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        confirmationPassword: value,
        loginErrors: {
          ...prevState.loginErrors,
          confirmPasswordError: "",
        },
      }));
    }
  };

  render() {
    // Destructure props:
    const {
      toNextPage,
      accountEmailAddress,
      setAccountEmailAddress,
      postalCodeIsValid,
      nameOrCityIsValid,
    } = this.props;

    const loginMethodHeaders = [
      {
        id: "logIn",
        className: this.state.isLoginMethodSelected
          ? style.selected
          : style.unselected,
        textContent: "Log In",
      },
      {
        id: "signUp",
        className: !this.state.isLoginMethodSelected
          ? style.selected
          : style.unselected,
        textContent: "Sign Up",
      },
    ];

    // Validate email address
    // Run onChange of email field of both login & signup
    const validateEmail = (e, isSignup) => {
      const value = e.target.value.trim();
      setAccountEmailAddress(value);
      const registeredAccount = this.getRegisteredAccount(value);
      if (isSignup) {
        if (registeredAccount) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "E-mail address already in use",
            },
          }));
        } else if (
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value.trim()
          )
        ) {
          // Update email error state value to "". Will need to access previous state values.
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "",
            },
          }));
        } else {
          // Update email error state value to an error message. Will need to access previous state values.
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "Please enter a valid email address",
            },
          }));
        }
      } else {
        if (
          !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value.trim()
          )
        ) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "Please enter a valid e-mail address",
            },
          }));
        }
        // If account exists w/ input email, but no PW has been entered yet
        else if (registeredAccount && !this.state.password.length) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "",
            },
          }));
          // If input PW matches PW of registered account
        } else if (registeredAccount?.password === this.state.password) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "",
              passwordError: "",
            },
          }));
          // If no account was found w/ input email
        } else if (!registeredAccount) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError: "E-mail address not recognized",
            },
          }));
          // If input email & PW are not associated
        } else {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              emailError:
                "E-mail address is not associated with password below",
            },
          }));
        }
      }
    };

    // Run onChange of PW field on login
    const validatePasswordOnLogin = (e) => {
      const value = e.target.value.trim();
      const userAccount = this.getRegisteredAccount(accountEmailAddress);
      const passwordExists = this.passwordExists(value);
      // User enters PW that is registered w/ at least one account, but there is no email input
      if (passwordExists && !accountEmailAddress.length) {
        this.setState((prevState) => ({
          ...prevState,
          password: value,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "",
          },
        }));
        // If input PW matches PW associated w/ userAccount
      } else if (userAccount?.password === value) {
        this.setState((prevState) => ({
          ...prevState,
          password: value,
          loginErrors: {
            ...prevState.loginErrors,
            emailError: "",
            passwordError: "",
          },
        }));
        // If PW isn't registered
        // Error message made vague for security purposes
      } else if (!passwordExists) {
        this.setState((prevState) => ({
          ...prevState,
          password: value,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "Password not recognized",
          },
        }));
        // If PW is registered, but doesn't match input email address
        // Error message made vague for security purposes
      } else {
        this.setState((prevState) => ({
          ...prevState,
          password: value,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "Password not recognized",
          },
        }));
      }
    };

    const loginAndSignupFormInputs = [
      {
        id: "signupEmail",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "E-mail Address:",
        placeholder: "E-mail address",
        inputType: "signupEmail",
        onChange: (e) => validateEmail(e, true),
        field: "email",
        required: !this.state.isLoginMethodSelected,
        inputMode: "email",
        autoComplete: "email",
        value: accountEmailAddress,
      },
      {
        id: "loginEmail",
        isHidden: !this.state.isLoginMethodSelected,
        labelText: "E-mail Address:",
        placeholder: "E-mail address",
        inputType: "email",
        onChange: (e) => validateEmail(e, false),
        field: "email",
        required: this.state.isLoginMethodSelected,
        inputMode: "email",
        autoComplete: "email",
        value: accountEmailAddress,
      },
      {
        id: "signupPassword",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
        onChange: this.validatePasswordOnSignup,
        field: "password",
        required: !this.state.isLoginMethodSelected,
        inputMode: "password",
      },
      {
        id: "signupConfirmPassword",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Confirm Password:",
        placeholder: "Confirm Password",
        inputType: this.state.passwordFieldInputType,
        onChange: this.validatePasswordConfirmation,
        field: "confirmPassword",
        required: this.state.isRequired,
        inputMode: "password",
        autoComplete: "off",
      },
      {
        id: "loginPassword",
        isHidden: !this.state.isLoginMethodSelected,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
        onChange: validatePasswordOnLogin,
        field: "password",
        required: this.state.isLoginMethodSelected,
        inputMode: "password",
        autoComplete: "current-password",
        value: this.state.loginPasswordValue,
      },
      {
        id: "loginFirstName",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "First Name:",
        placeholder: "Enter first name",
        inputType: "text",
        onChange: (e) => {
          this.setState((prevState) => ({
            ...prevState,
            firstName: e.target.value,
          }));
          if (nameOrCityIsValid(e.target.value)) {
            this.setState((prevState) => ({
              ...prevState,
              loginErrors: {
                ...prevState.loginErrors,
                firstNameError: "",
              },
            }));
          } else {
            this.setState((prevState) => ({
              ...prevState,
              loginErrors: {
                ...prevState.loginErrors,
                firstNameError:
                  "Enter alphabetical characters & any spaces or hyphens between words",
              },
            }));
          }
        },
        field: "firstName",
        required: this.state.isRequired,
        inputMode: "text",
        autoComplete: "given-name",
        value: this.state.firstName ? this.state.firstName : "",
      },
      {
        id: "loginLastName",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Last Name:",
        placeholder: "Enter last name",
        inputType: "text",
        onChange: (e) => {
          this.setState((prevState) => ({
            ...prevState,
            lastName: e.target.value,
          }));
          if (nameOrCityIsValid(e.target.value)) {
            this.setState((prevState) => ({
              ...prevState,
              loginErrors: {
                ...prevState.loginErrors,
                lastNameError: "",
              },
            }));
          } else {
            this.setState((prevState) => ({
              ...prevState,
              loginErrors: {
                ...prevState.loginErrors,
                lastNameError:
                  "Enter alphabetical characters & any spaces or hyphens between words",
              },
            }));
          }
        },
        field: "lastName",
        required: this.state.isRequired,
        inputMode: "text",
        autoComplete: "family-name",
      },
      {
        id: "loginPostalCode",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Postal Code:",
        placeholder: "5-digit US ZIP",
        inputType: "text",
        onChange: (e) => {
          postalCodeIsValid(e.target.value.trim())
            ? this.setState((prevState) => ({
                ...prevState,
                loginErrors: {
                  ...prevState.loginErrors,
                  postalCodeError: "",
                },
              }))
            : this.setState((prevState) => ({
                ...prevState,
                loginErrors: {
                  ...prevState.loginErrors,
                  postalCodeError: "5-digit US postal code",
                },
              }));
        },
        field: "postalCode",
        required: this.state.isRequired,
        inputMode: "numeric",
        autoComplete: "postal-code",
      },
    ];

    const areNoErrors = Object.values(this.state.loginErrors).every(
      (element) => element === ""
    );

    return (
      <div id="loginAndCart">
        <div id="homepageContainer">
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
              toNextPage(e, "Login");
            }}
          >
            {loginAndSignupFormInputs.map((input) => (
              <label key={input.id} hidden={input.isHidden}>
                <header key={input.labelText + "1"}>{input.labelText}</header>
                <div className="inputFieldWithImage">
                  {input.labelText.includes("Password") && this.state.eyeLogo}
                  <input
                    id={input.id}
                    key={input.labelText + "2"}
                    placeholder={input.placeholder}
                    type={
                      input.labelText.includes("Password")
                        ? this.state.passwordFieldInputType
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
                {input.labelText === "Password:" &&
                !this.state.isLoginMethodSelected ? (
                  <p>
                    Must contain at least 1 uppercase & 1 lowercase English
                    letter, at least 1 digit, at least 1 special character (#,
                    ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long
                  </p>
                ) : (
                  <p>{this.state.loginErrors[`${input.field}Error`]}</p>
                )}
              </label>
            ))}
            <div id={style.loginBtnsContainer}>
              <button
                type={!areNoErrors ? "button" : "submit"}
                onClick={!areNoErrors ? alertFormErrors : undefined}
              >
                {this.state.isLoginMethodSelected ? "Log In" : "Create Account"}
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
      </div>
    );
  }
}

export default Login;
