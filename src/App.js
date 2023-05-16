import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Login from "./Components/Login/Login";
import Cart from "./Components/Cart/Cart";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageDisplayOptions: {
        isLoginHidden: false,
        isCartHidden: true,
        isShippingHidden: true,
        isDeliveryHidden: true,
        isConfirmationHidden: true,
      },
    };
  }

  // Method to move to next page:
  // Pass to Login.jsx for onClick of Sign in or Create Account btn
  // Must change this.state.isLoginHidden to true
  toNextPage = (e) => {
    e.preventDefault();

    // Only move on if there are no errors in error object! ---- if each error === ""
    // May need to pass errors object from each comp to App.js or init this in App.js then export as prop to components
    // Or, find a way to only call this in each comp if its own error state object contains no errors (if all Object.values of this.state.errors === "", then call this onClick. Requires conditional rendering in this onClick)

    /* let pageDisplayed = Object.entries(this.state.pageDisplayOptions).find(
      (pair) => pair[1] === false
    );
    console.log(Object.entries(this.state.pageDisplayOptions));
    console.log(pageDisplayed);
    console.log(pageDisplayed[0]);
    let currentDisplayedPage = this.state.pageDisplayOptions[pageDisplayed[0]];
    console.log(currentDisplayedPage); */
    if (!this.state.pageDisplayOptions.isLoginHidden) {
      this.setState((prevState) => ({
        pageDisplayOptions: {
          ...prevState.pageDisplayOptions,
          isLoginHidden: true,
          isCartHidden: false,
        },
      }));
    }
  };

  // Method to go to previous page:

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>codeCommerce</h1>
          <Login
            isLoginHidden={this.state.pageDisplayOptions.isLoginHidden}
            toNextPage={this.toNextPage}
          />
          <Cart />
        </header>
      </div>
    );
  }
}

export default App;
