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
    return (
      <div id="homepageContainer">
        <header>Welcome to codeCommerce!</header>
        <div id={style.homepageOptions}>
          <header
            id="logIn"
            className={
              this.state.loginSelected ? style.selected : style.unselected
            }
            onClick={this.selectLoginMethod}
          >
            Log In
          </header>
          <header
            id="signUp"
            className={
              !this.state.loginSelected ? style.selected : style.unselected
            }
            onClick={this.selectLoginMethod}
          >
            Sign Up
          </header>
        </div>
      </div>
    );
  }
}

export default Login;
