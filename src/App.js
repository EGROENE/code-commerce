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
  // Only move on if there are no errors in error object
  // Must change this.state.isLoginHidden to true
  toNextPage = () => {
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
