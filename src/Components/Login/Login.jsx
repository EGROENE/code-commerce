import React from "react";
import style from "./Login.module.css";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loginMethodSelected: true,
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
        firstNameError: "",
        lastNameError: "",
        postalCodeError: "",
      },
    };
  }

  selectLoginMethod = (e) => {
    if (!this.state.isOpenEye) {
      this.showHidePassword();
    }
    e.target.id === "logIn"
      ? this.setState({
          loginMethodSelected: true,
          passwordPlaceholder: "Enter your password",
        })
      : this.setState({
          loginMethodSelected: false,
          passwordPlaceholder: "Create a password",
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
      }));
    } else {
      console.log("invalid pw");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          passwordError:
            "Password must contain at least 1 uppercase & 1 lowercase English letter, at least 1 digit, at least 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
        },
      }));
    }
  };

  // Validate password confirmation:

  // Validate first name:

  // Validate last name:

  // Validate postal code:

  render() {
    const { isLoginHidden } = this.props;

    const loginMethodHeaders = [
      {
        id: "logIn",
        className: this.state.loginMethodSelected
          ? style.selected
          : style.unselected,
        textContent: "Log In",
      },
      {
        id: "signUp",
        className: !this.state.loginMethodSelected
          ? style.selected
          : style.unselected,
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
      },
      {
        isHidden: false,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
        onChange: this.validatePassword,
        field: "password",
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "Confirm Password:",
        placeholder: "Confirm Password",
        inputType: this.state.passwordFieldInputType,
        field: "confirmPassword",
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "First Name:",
        placeholder: "Enter your first name",
        inputType: "text",
        field: "firstName",
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "Last Name:",
        placeholder: "Enter your last name",
        inputType: "text",
        field: "lastName",
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "Postal Code:",
        placeholder: "Enter your postal code",
        inputType: "text",
        field: "postalCode",
      },
    ];

    return (
      <main hidden={isLoginHidden} id="homepageContainer">
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
        <form>
          {formInputs.map((input) => (
            <label key={input.labelText} hidden={input.isHidden}>
              <p key={input.labelText + "1"}>{input.labelText}</p>
              {input.labelText.includes("Password") && this.state.eyeLogo}
              <input
                key={input.labelText + "2"}
                placeholder={input.placeholder}
                type={
                  input.labelText.includes("Password")
                    ? this.state.passwordFieldInputType
                    : input.inputType
                }
                onChange={input.onChange}
                required
              />
              <p>{this.state.errors[`${input.field}Error`]}</p>
            </label>
          ))}
          <div id={style.loginBtnsContainer}>
            <button>
              {this.state.loginMethodSelected ? "Log In" : "Create Account"}
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
      </main>
    );
  }
}

export default Login;
