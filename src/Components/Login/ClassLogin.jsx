import React from "react";
import style from "./Login.module.css";
import loginStyle from "./Login.module.css";
import { registeredAccounts } from "../../constants";
import {
  passwordIsValid,
  nameOrCityIsValid,
  postalCodeIsValid,
  emailIsValid,
} from "../../validations";

class ClassLogin extends React.Component {
  constructor() {
    super();
    this.state = {
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
        accountEmailError: "",
        passwordError: "",
        confirmationPasswordError: "",
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
        accountEmailError: "",
        passwordError: "",
        confirmationPasswordError: "",
        firstNameError: "",
        lastNameError: "",
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

  // Call the method below to return the account associated w/ the input email address
  getRegisteredAccount = (email) => {
    return registeredAccounts.find((account) => account.email === email);
  };

  passwordDoesExist = (password) => {
    return registeredAccounts
      .map((account) => account.password)
      .includes(password);
  };

  render() {
    // Destructure props:
    const {
      handleRejection,
      hasFailedSubmission,
      toNextPage,
      loginData,
      setLoginData,
    } = this.props;

    const clearLoginData = () => {
      Object.keys(loginData).forEach((key) => setLoginData(key, ""));
    };

    const selectLoginMethod = (e) => {
      clearLoginData();
      this.clearLoginErrors();
      if (!this.state.isOpenEye) {
        this.showHidePassword();
      }
      e.target.id === "logIn"
        ? this.userSelectsLogin()
        : this.userSelectsSignUp();
    };

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

    const handleEmailInput = (e, isSignup) => {
      const value = e.target.value.trim().toLowerCase();
      setLoginData("accountEmail", value);
      const registeredAccount = this.getRegisteredAccount(value);
      if (isSignup) {
        if (registeredAccount) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "E-mail address already in use",
            },
          }));
        } else if (emailIsValid(value.trim())) {
          // Update email error state value to "". Will need to access previous state values.
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "",
            },
          }));
        } else {
          // Update email error state value to an error message. Will need to access previous state values.
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "Please enter a valid email address",
            },
          }));
        }
      } else {
        if (!emailIsValid(value.trim())) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "Please enter a valid e-mail address",
            },
          }));
        }
        // If account exists w/ input email, but no PW has been entered yet
        else if (registeredAccount && !loginData.password.length) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "",
            },
          }));
          // If input PW matches PW of registered account
        } else if (registeredAccount?.password === loginData.password) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "",
              passwordError: "",
            },
          }));
          // If no account was found w/ input email
        } else if (!registeredAccount) {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError: "E-mail address not recognized",
            },
          }));
          // If input email & PW are not associated
        } else {
          this.setState((prevState) => ({
            loginErrors: {
              ...prevState.loginErrors,
              accountEmailError:
                "E-mail address is not associated with password below",
            },
          }));
        }
      }
    };

    // Run onChange of PW field on login
    const handlePasswordInputOnLogin = (e) => {
      const value = e.target.value.trim();
      const userAccount = this.getRegisteredAccount(loginData.accountEmail);
      const passwordExists = this.passwordDoesExist(value);
      setLoginData("password", value);
      // User enters PW that is registered w/ at least one account, but there is no email input
      if (passwordExists && !loginData.accountEmail.length) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "",
          },
        }));
        // If input PW matches PW associated w/ userAccount
      } else if (userAccount?.password === value) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            accountEmailError: "",
            passwordError: "",
          },
        }));
        // If PW isn't registered
        // Error message made vague for security purposes
      } else if (!passwordExists) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "Password not recognized",
          },
        }));
      } else if (passwordExists) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "",
          },
        }));
      } else if (passwordExists && userAccount) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            accountEmailError: "",
            passwordError: "",
          },
        }));
      }
    };

    const handlePasswordInputOnSignup = (e) => {
      const value = e.target.value.trim();
      setLoginData("password", value);

      if (passwordIsValid(value)) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError: "",
          },
        }));
      }
      if (
        loginData.confirmationPassword.length &&
        loginData.confirmationPassword !== value
      ) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            confirmationPasswordError: "Passwords do not match",
          },
        }));
      }
      if (
        loginData.confirmationPassword.length &&
        loginData.confirmationPassword === value
      ) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            confirmationPasswordError: "",
          },
        }));
      }
      if (passwordIsValid(value) && loginData.confirmationPassword === value) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            confirmationPasswordError: "",
            passwordError: "",
          },
        }));
      }
      if (!passwordIsValid(value)) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            passwordError:
              "Password must contain >= 1 uppercase & 1 lowercase English letter, >= 1 digit, >= 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
          },
        }));
      }
    };

    const handlePasswordConfirmation = (e) => {
      const value = e.target.value.trim();
      setLoginData("confirmationPassword", value);

      if (loginData.password.length && loginData.password !== value) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            confirmationPasswordError: "Passwords do not match",
          },
        }));
      }
      if (loginData.password.length && loginData.password === value) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            confirmationPasswordError: "",
          },
        }));
      }
      if (passwordIsValid(loginData.password) && loginData.password === value) {
        this.setState((prevState) => ({
          ...prevState,
          loginErrors: {
            ...prevState.loginErrors,
            confirmationPasswordError: "",
            passwordError: "",
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
        onChange: (e) => handleEmailInput(e, true),
        field: "accountEmail",
        required: !this.state.isLoginMethodSelected,
        inputMode: "email",
        autoComplete: "email",
        value: loginData.accountEmail,
      },
      {
        id: "loginEmail",
        isHidden: !this.state.isLoginMethodSelected,
        labelText: "E-mail Address:",
        placeholder: "E-mail address",
        inputType: "email",
        onChange: (e) => handleEmailInput(e, false),
        field: "accountEmail",
        required: this.state.isLoginMethodSelected,
        inputMode: "email",
        autoComplete: "email",
        value: loginData.accountEmail,
      },
      {
        id: "signupPassword",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
        onChange: handlePasswordInputOnSignup,
        field: "password",
        required: !this.state.isLoginMethodSelected,
        inputMode: "password",
        value: loginData.password,
      },
      {
        id: "confirmationPassword",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Confirm Password:",
        placeholder: "Confirm Password",
        inputType: this.state.passwordFieldInputType,
        onChange: handlePasswordConfirmation,
        field: "confirmationPassword",
        required: this.state.isRequired,
        inputMode: "password",
        autoComplete: "off",
        value: loginData.confirmationPassword,
      },
      {
        id: "loginPassword",
        isHidden: !this.state.isLoginMethodSelected,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
        onChange: handlePasswordInputOnLogin,
        field: "password",
        required: this.state.isLoginMethodSelected,
        inputMode: "password",
        autoComplete: "current-password",
        value: loginData.password,
      },
      {
        id: "signupFirstName",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "First Name:",
        placeholder: "Enter first name",
        inputType: "text",
        onChange: (e) => {
          setLoginData("firstName", e.target.value);
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
        value: loginData.firstName,
      },
      {
        id: "signupLastName",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Last Name:",
        placeholder: "Enter last name",
        inputType: "text",
        onChange: (e) => {
          setLoginData("lastName", e.target.value);
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
        value: loginData.lastName,
      },
      {
        id: "signupPostalCode",
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Postal Code:",
        placeholder: "5-digit US ZIP",
        inputType: "text",
        onChange: (e) => {
          setLoginData("postalCode", e.target.value);
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
        value: loginData.postalCode,
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
                onClick={selectLoginMethod}
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
                    className={
                      hasFailedSubmission &&
                      (this.state.loginErrors[`${input.field}Error`] !== "" ||
                        loginData[input.field] === "")
                        ? "inputWhenError"
                        : undefined
                    }
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
                  <p>
                    {hasFailedSubmission &&
                      this.state.loginErrors[`${input.field}Error`]}
                  </p>
                )}
              </label>
            ))}
            <div id={style.loginBtnsContainer}>
              <button
                type={!areNoErrors ? "button" : "submit"}
                onClick={!areNoErrors ? handleRejection : undefined}
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

export default ClassLogin;
