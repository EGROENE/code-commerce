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
    };
  }

  selectLoginMethod = (e) => {
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
      },
      {
        isHidden: false,
        labelText: "Password:",
        placeholder: this.state.passwordPlaceholder,
        inputType: this.state.passwordFieldInputType,
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "Confirm Password:",
        placeholder: "Confirm Password",
        inputType: this.state.passwordFieldInputType,
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "First Name:",
        placeholder: "Enter your first name",
        inputType: "text",
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "Last Name:",
        placeholder: "Enter your last name",
        inputType: "text",
      },
      {
        isHidden: this.state.loginMethodSelected,
        labelText: "Postal Code:",
        placeholder: "Enter your postal code",
        inputType: "text",
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
                required
              />
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
