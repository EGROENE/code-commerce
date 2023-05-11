import React from "react";
import style from "./Login.module.css";

class Login extends React.Component {
  constructor() {
    super();
    this.state = { loginSelected: true };
  }

  selectLoginMethod = (e) => {
    e.target.id === "logIn"
      ? this.setState({ loginSelected: true })
      : this.setState({ loginSelected: false });
  };

  render() {
    const loginMethodHeaders = [
      {
        id: "logIn",
        className: this.state.loginSelected ? style.selected : style.unselected,
        textContent: "Log In",
      },
      {
        id: "signUp",
        className: !this.state.loginSelected
          ? style.selected
          : style.unselected,
        textContent: "Sign Up",
      },
    ];

    return (
      <div id="homepageContainer">
        <header>Welcome to codeCommerce!</header>
        <div id={style.homepageOptions}>
          {loginMethodHeaders.map((option) => (
            <header
              id={option.id}
              className={option.className}
              onClick={this.selectLoginMethod}
            >
              {option.textContent}
            </header>
          ))}
        </div>
        {/* Next, display certain form options, depending on truthiness of loginSelected */}
      </div>
    );
  }
}

export default Login;
