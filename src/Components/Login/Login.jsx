import React from "react";
import style from "./Login.module.css";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoginMethodSelected: true,
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
        emailError: "",
        passwordError: "",
        confirmPasswordError: "",
        nameError: "",
        postalCodeError: "",
      },
      password: "",
      isRequired: false,
    };
  }

  selectLoginMethod = (e) => {
    if (!this.state.isOpenEye) {
      this.showHidePassword();
    }
    e.target.id === "logIn"
      ? this.setState({
          isLoginMethodSelected: true,
          passwordPlaceholder: "Enter your password",
          isRequired: false,
        })
      : this.setState({
          isLoginMethodSelected: false,
          passwordPlaceholder: "Create a password",
          isRequired: true,
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

  // Validate email address:
  validateEmail = (e) => {
    let value = e.target.value;
    // If value of email field matches regex:
    if (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        value.trim()
      )
    ) {
      console.log("valid");
      // Update email error state value to "". Will need to access previous state values.
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          emailError: "",
        },
      }));
    } else {
      console.log("invalid");
      // Update email error state value to an error message. Will need to access previous state values.
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          emailError: "Please enter a valid email address",
        },
      }));
    }
  };

  // Validate password:
  validatePassword = (e) => {
    let value = e.target.value;
    if (
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/.test(
        value.trim()
      )
    ) {
      console.log("valid pw");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          passwordError: "",
        },
        password: value,
      }));
    } else {
      console.log("invalid pw");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          passwordError:
            "Password must contain at least 1 uppercase & 1 lowercase English letter, at least 1 digit, at least 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
        },
        password: "",
      }));
    }
  };

  // Validate password confirmation:
  validatePasswordConfirmation = (e) => {
    let value = e.target.value;
    if (this.state.password !== value) {
      console.log("no match");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          confirmPasswordError: "Passwords do not match",
        },
      }));
    } else {
      console.log("match");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          confirmPasswordError: "",
        },
      }));
    }
  };

  // Validate name:
  validateNames = (e) => {
    let value = e.target.value;
    if (/^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value)) {
      console.log("valid name");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          nameError: "",
        },
      }));
    } else {
      console.log("invalid name");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          nameError:
            "Enter only alphanumeric characters & any hyphens b/t names",
        },
      }));
    }
  };

  // Validate postal code:
  validatePostalCode = (e) => {
    let value = e.target.value;
    if (/^[0-9]{5}$/i.test(value)) {
      console.log("valid zip");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCodeError: "",
        },
      }));
    } else {
      console.log("invalid zip");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCodeError: "Enter first 5 digits of US postal code",
        },
      }));
    }
  };

  render() {
    const { isLoginHidden, toNextPage } = this.props;

    const { isLoginMethodSelected, eyeLogo, passwordFieldInputType, errors } =
      this.state;

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
        isHidden: false,
        labelText: "Email Address:",
        placeholder: "Enter your email address",
        inputType: "email",
        onChange: this.validateEmail,
        field: "email",
        required: true,
      },
      {
        isHidden: false,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
        onChange: this.validatePassword,
        field: "password",
        required: true,
      },
      {
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Confirm Password:",
        placeholder: "Confirm Password",
        inputType: this.state.passwordFieldInputType,
        onChange: this.validatePasswordConfirmation,
        field: "confirmPassword",
        required: this.state.isRequired,
      },
      {
        isHidden: this.state.isLoginMethodSelected,
        labelText: "First Name:",
        placeholder: "Enter your first name",
        inputType: "text",
        onChange: this.validateNames,
        field: "name",
        required: this.state.isRequired,
      },
      {
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Last Name:",
        placeholder: "Enter your last name",
        inputType: "text",
        onChange: this.validateNames,
        field: "name",
        required: this.state.isRequired,
      },
      {
        isHidden: this.state.isLoginMethodSelected,
        labelText: "Postal Code:",
        placeholder: "US postal code (ex. 12345)",
        inputType: "text",
        onChange: this.validatePostalCode,
        field: "postalCode",
        required: this.state.isRequired,
      },
    ];

    return (
      <div hidden={isLoginHidden} id="homepageContainer">
        <header>Welcome to codeCommerce!</header>
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
              {input.labelText.includes("Password") && eyeLogo}
              <input
                key={input.labelText + "2"}
                placeholder={input.placeholder}
                type={
                  input.labelText.includes("Password")
                    ? passwordFieldInputType
                    : input.inputType
                }
                onChange={input.onChange}
                required={input.required}
              />
              <p>{errors[`${input.field}Error`]}</p>
            </label>
          ))}
          <div id={style.loginBtnsContainer}>
            <button type="submit">
              {isLoginMethodSelected ? "Log In" : "Create Account"}
            </button>
            <p>or</p>
            <a href="#" id={style.facebookLogin}>
              <i className="fab fa-facebook-f"></i>Log in with Facebook
            </a>
            <div id={style.termsLinksContainer}>
              <a href="#" className={style.termsAndConditionsLinks}>
                Privacy Policy & Cookies
              </a>
              <a href="#" className={style.termsAndConditionsLinks}>
                Terms of Sale & Use
              </a>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
