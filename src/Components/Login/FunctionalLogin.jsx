import { useState } from "react";
import style from "./Login.module.css";
import loginStyle from "./Login.module.css";
import { registeredAccounts } from "../../constants";
import {
  passwordIsValid,
  nameOrCityIsValid,
  postalCodeIsValid,
  emailIsValid,
} from "../../validations";

const FunctionalLogin = ({
  handleRejection,
  hasFailedSubmission,
  toNextPage,
  loginData,
  setLoginData,
}) => {
  const [isLoginMethodSelected, setIsLoginMethodSelected] = useState(true);

  const [isRequired, setIsRequired] = useState(false);

  const [passwordPlaceholder, setPasswordPlaceholder] = useState(
    "Enter your password"
  );

  const [passwordFieldInputType, setPasswordFieldInputType] =
    useState("password");

  const [isOpenEye, setIsOpenEye] = useState(true);

  const [loginErrors, setLoginErrors] = useState({
    accountEmailError: "",
    passwordError: "",
    confirmationPasswordError: "",
    firstNameError: "",
    lastNameError: "",
    postalCodeError: "",
  });

  const showPassword = () => {
    setIsOpenEye(false);
    setEyeLogo(
      <i
        id="slashedEye"
        className={`far fa-eye-slash ${loginStyle.eye}`}
        title="Hide Password"
        onClick={hidePassword}
      ></i>
    );
    setPasswordFieldInputType("text");
  };

  const hidePassword = () => {
    setIsOpenEye(true);
    setEyeLogo(
      <i
        id="openEye"
        className={`far fa-eye ${loginStyle.eye}`}
        title="Show Password"
        onClick={showPassword}
      ></i>
    );
    setPasswordFieldInputType("password");
  };

  const [eyeLogo, setEyeLogo] = useState(
    <i
      id="openEye"
      className={`far fa-eye ${loginStyle.eye}`}
      title="Show Password"
      onClick={hidePassword}
    ></i>
  );

  const clearLoginErrors = () => {
    setLoginErrors({
      accountEmailError: "",
      passwordError: "",
      confirmationPasswordError: "",
      firstNameError: "",
      lastNameError: "",
      postalCodeError: "",
    });
  };

  const userSelectsLogin = () => {
    setIsLoginMethodSelected(true);
    setPasswordPlaceholder("Enter your password");
    setIsRequired(false);
  };

  const userSelectsSignUp = () => {
    setIsLoginMethodSelected(false);
    setPasswordPlaceholder("Create a password");
    setIsRequired(true);
  };

  const getRegisteredAccount = (email) => {
    return registeredAccounts.find((account) => account.email === email);
  };

  const clearLoginData = () => {
    Object.keys(loginData).forEach((key) => setLoginData(key, ""));
  };

  const selectLoginMethod = (e) => {
    clearLoginData();
    clearLoginErrors();
    if (!isOpenEye) {
      hidePassword();
    }
    e.target.id === "logIn" ? userSelectsLogin() : userSelectsSignUp();
  };

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

  const handleEmailInput = (e, isSignup) => {
    const value = e.target.value.trim().toLowerCase();
    setLoginData("accountEmail", value);
    const registeredAccount = getRegisteredAccount(value);
    if (isSignup) {
      if (registeredAccount) {
        setLoginErrors((prevState) => {
          return {
            ...prevState,
            accountEmailError: "E-mail address already in use",
          };
        });
      } else if (emailIsValid(value.trim())) {
        // Update email error state value to "". Will need to access previous state values.
        setLoginErrors((prevState) => {
          return { ...prevState, accountEmailError: "" };
        });
      } else {
        // Update email error state value to an error message. Will need to access previous state values.
        setLoginErrors((prevState) => {
          return {
            ...prevState,
            accountEmailError: "Please enter a valid email address",
          };
        });
      }
    } else {
      if (!emailIsValid(value.trim())) {
        setLoginErrors((prevState) => {
          return {
            ...prevState,
            accountEmailError: "Please enter a valid email address",
          };
        });
      }
      // If account exists w/ input email, but no PW has been entered yet
      else if (registeredAccount && !loginData.password.length) {
        setLoginErrors((prevState) => {
          return { ...prevState, accountEmailError: "" };
        });
        // If input PW matches PW of registered account
      } else if (registeredAccount?.password === loginData.password) {
        setLoginErrors((prevState) => {
          return { ...prevState, accountEmailError: "", passwordError: "" };
        });
        // If no account was found w/ input email
      } else if (!registeredAccount) {
        setLoginErrors((prevState) => {
          return {
            ...prevState,
            accountEmailError: "E-mail address not recognized",
          };
        });
        // If input email & PW are not associated
      } else {
        setLoginErrors((prevState) => {
          return {
            ...prevState,
            accountEmailError:
              "E-mail address is not associated with password below",
          };
        });
      }
    }
  };

  const passwordDoesExist = (password) => {
    return registeredAccounts
      .map((account) => account.password)
      .includes(password);
  };

  // Run onChange of PW field on login
  const handlePasswordInputOnLogin = (e) => {
    const value = e.target.value.trim();
    const userAccount = getRegisteredAccount(loginData.accountEmail);
    const passwordExists = passwordDoesExist(value);
    setLoginData("password", value);
    // User enters PW that is registered w/ at least one account, but there is no email input
    if (passwordExists && !loginData.accountEmail.length) {
      setLoginErrors((prevState) => {
        return { ...prevState, passwordError: "" };
      });
      // If input PW matches PW associated w/ userAccount
    } else if (userAccount?.password === value) {
      setLoginErrors((prevState) => {
        return { ...prevState, passwordError: "", accountEmailError: "" };
      });
      // If PW isn't registered
      // Error message made vague for security purposes
    } else if (!passwordExists) {
      setLoginErrors((prevState) => {
        return { ...prevState, passwordError: "Password not recognized" };
      });
    } else if (passwordExists) {
      setLoginErrors((prevState) => {
        return { ...prevState, passwordError: "" };
      });
    } else if (passwordExists && userAccount) {
      setLoginErrors((prevState) => {
        return { ...prevState, passwordError: "", accountEmailError: "" };
      });
    }
  };

  const handlePasswordInputOnSignup = (e) => {
    const value = e.target.value.trim();
    setLoginData("password", value);

    if (passwordIsValid(value)) {
      setLoginErrors((prevState) => {
        return { ...prevState, passwordError: "" };
      });
    }
    if (
      loginData.confirmationPassword.length &&
      loginData.confirmationPassword !== value
    ) {
      setLoginErrors((prevState) => {
        return {
          ...prevState,
          confirmationPasswordError: "Passwords do not match",
        };
      });
    }
    if (
      loginData.confirmationPassword.length &&
      loginData.confirmationPassword === value
    ) {
      setLoginErrors((prevState) => {
        return { ...prevState, confirmationPasswordError: "" };
      });
    }
    if (passwordIsValid(value) && loginData.confirmationPassword === value) {
      setLoginErrors((prevState) => {
        return {
          ...prevState,
          confirmationPasswordError: "",
          passwordError: "",
        };
      });
    }
    if (!passwordIsValid(value)) {
      setLoginErrors((prevState) => {
        return {
          ...prevState,
          passwordError:
            "Password must contain >= 1 uppercase & 1 lowercase English letter, >= 1 digit, >= 1 special character (#, ?, !, @, $, %, ^, &, *, -), & be 8-20 characters long",
        };
      });
    }
  };

  const handlePasswordConfirmation = (e) => {
    const value = e.target.value.trim();
    setLoginData("confirmationPassword", value);

    if (loginData.password.length && loginData.password !== value) {
      setLoginErrors((prevState) => {
        return {
          ...prevState,
          confirmationPasswordError: "Passwords do not match",
        };
      });
    }
    if (loginData.password.length && loginData.password === value) {
      setLoginErrors((prevState) => {
        return { ...prevState, confirmationPasswordError: "" };
      });
    }
    if (passwordIsValid(loginData.password) && loginData.password === value) {
      setLoginErrors((prevState) => {
        return {
          ...prevState,
          confirmationPasswordError: "",
          passwordError: "",
        };
      });
    }
  };

  const loginAndSignupFormInputs = [
    {
      id: "signupEmail",
      isHidden: isLoginMethodSelected,
      labelText: "E-mail Address:",
      placeholder: "E-mail address",
      inputType: "signupEmail",
      onChange: (e) => handleEmailInput(e, true),
      field: "accountEmail",
      required: !isLoginMethodSelected,
      inputMode: "email",
      autoComplete: "email",
      value: loginData.accountEmail,
    },
    {
      id: "loginEmail",
      isHidden: !isLoginMethodSelected,
      labelText: "E-mail Address:",
      placeholder: "E-mail address",
      inputType: "email",
      onChange: (e) => handleEmailInput(e, false),
      field: "accountEmail",
      required: isLoginMethodSelected,
      inputMode: "email",
      autoComplete: "email",
      value: loginData.accountEmail,
    },
    {
      id: "signupPassword",
      isHidden: isLoginMethodSelected,
      labelText: "Password:",
      placeholder: passwordPlaceholder,
      inputType: passwordFieldInputType,
      onChange: handlePasswordInputOnSignup,
      field: "password",
      required: !isLoginMethodSelected,
      inputMode: "password",
      value: loginData.password,
    },
    {
      id: "confirmationPassword",
      isHidden: isLoginMethodSelected,
      labelText: "Confirm Password:",
      placeholder: "Confirm Password",
      inputType: passwordFieldInputType,
      onChange: handlePasswordConfirmation,
      field: "confirmationPassword",
      required: isRequired,
      inputMode: "password",
      autoComplete: "off",
      value: loginData.confirmationPassword,
    },
    {
      id: "loginPassword",
      isHidden: !isLoginMethodSelected,
      labelText: "Password:",
      placeholder: passwordPlaceholder,
      inputType: passwordFieldInputType,
      onChange: handlePasswordInputOnLogin,
      field: "password",
      required: isLoginMethodSelected,
      inputMode: "password",
      autoComplete: "current-password",
      value: loginData.password,
    },
    {
      id: "signupFirstName",
      isHidden: isLoginMethodSelected,
      labelText: "First Name:",
      placeholder: "Enter first name",
      inputType: "text",
      onChange: (e) => {
        setLoginData("firstName", e.target.value);
        if (nameOrCityIsValid(e.target.value)) {
          setLoginErrors((prevState) => {
            return { ...prevState, firstNameError: "" };
          });
        } else {
          setLoginErrors((prevState) => {
            return {
              ...prevState,
              firstNameError:
                "Enter alphabetical characters & any spaces or hyphens between words",
            };
          });
        }
      },
      field: "firstName",
      required: isRequired,
      inputMode: "text",
      autoComplete: "given-name",
      value: loginData.firstName,
    },
    {
      id: "signupLastName",
      isHidden: isLoginMethodSelected,
      labelText: "Last Name:",
      placeholder: "Enter last name",
      inputType: "text",
      onChange: (e) => {
        setLoginData("lastName", e.target.value);
        if (nameOrCityIsValid(e.target.value)) {
          setLoginErrors((prevState) => {
            return { ...prevState, lastNameError: "" };
          });
        } else {
          setLoginErrors((prevState) => {
            return {
              ...prevState,
              lastNameError:
                "Enter alphabetical characters & any spaces or hyphens between words",
            };
          });
        }
      },
      field: "lastName",
      required: isRequired,
      inputMode: "text",
      autoComplete: "family-name",
      value: loginData.lastName,
    },
    {
      id: "signupPostalCode",
      isHidden: isLoginMethodSelected,
      labelText: "Postal Code:",
      placeholder: "5-digit US ZIP",
      inputType: "text",
      onChange: (e) => {
        setLoginData("postalCode", e.target.value);
        postalCodeIsValid(e.target.value.trim())
          ? setLoginErrors((prevState) => {
              return { ...prevState, postalCodeError: "" };
            })
          : setLoginErrors((prevState) => {
              return {
                ...prevState,
                postalCodeError: "5-digit US postal code",
              };
            });
      },
      field: "postalCode",
      required: isRequired,
      inputMode: "numeric",
      autoComplete: "postal-code",
      value: loginData.postalCode,
    },
  ];

  const areNoErrors = Object.values(loginErrors).every(
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
                {input.labelText.includes("Password") && eyeLogo}
                <input
                  className={
                    hasFailedSubmission &&
                    (loginErrors[`${input.field}Error`] !== "" ||
                      loginData[input.field] === "")
                      ? "inputWhenError"
                      : undefined
                  }
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
                  minLength={input.labelText === "Postal Code:" ? 5 : undefined}
                  maxLength={input.labelText === "Postal Code:" ? 5 : undefined}
                  autoComplete={input.autoComplete}
                  value={input.value}
                />
              </div>
              {input.labelText === "Password:" && !isLoginMethodSelected ? (
                <p>
                  Must contain at least 1 uppercase & 1 lowercase English
                  letter, at least 1 digit, at least 1 special character (#, ?,
                  !, @, $, %, ^, &, *, -), & be 8-20 characters long
                </p>
              ) : (
                <p>
                  {hasFailedSubmission && loginErrors[`${input.field}Error`]}
                </p>
              )}
            </label>
          ))}
          <div id={style.loginBtnsContainer}>
            <button
              type={!areNoErrors ? "button" : "submit"}
              onClick={!areNoErrors ? handleRejection : undefined}
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
};

export default FunctionalLogin;
