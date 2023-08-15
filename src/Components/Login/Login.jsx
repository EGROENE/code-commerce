import React from "react";
import style from "./Login.module.css";
import { alertFormErrors } from "../../methods";

class Login extends React.Component {
  render() {
    // Destructure props:
    const {
      toNextPage,
      loginErrors,
      selectLoginMethod,
      validateEmailSignup,
      validateEmailLogin,
      validatePasswordSignup,
      validatePasswordConfirmation,
      validatePasswordLogin,
      validateNames,
      validatePostalCode,
      isLoginMethodSelected,
      isRequired,
      passwordPlaceholder,
      passwordFieldInputType,
      eyeLogo,
      signupEmailFieldValue,
      loginEmailFieldValue,
      loginPasswordValue,
    } = this.props;

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
        onChange: validateEmailSignup,
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
        onChange: validateEmailLogin,
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
        onChange: validatePasswordSignup,
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
        onChange: validatePasswordConfirmation,
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
        onChange: validatePasswordLogin,
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
        onChange: validateNames,
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
        onChange: validateNames,
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
        onChange: validatePostalCode,
        field: "postalCode",
        required: isRequired,
        inputMode: "numeric",
        autoComplete: "postal-code",
      },
    ];

    let areNoErrors = Object.values(loginErrors).every(
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
            {formInputs.map((input) => (
              <label key={input.id} hidden={input.isHidden}>
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
                  <p>{loginErrors[`${input.field}Error`]}</p>
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
      </div>
    );
  }
}

export default Login;
