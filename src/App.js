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
        isPaymentHidden: true,
        isConfirmationHidden: true,
      },
    };
  }

  // Method to move to next page:
  // Pass to Login.jsx for onClick of Sign in or Create Account btn
  // Must change this.state.isLoginHidden to true
  toNextPage = (e, selectedPageHidden, nextPageHidden) => {
    e.preventDefault();

    if (!this.state.pageDisplayOptions[selectedPageHidden]) {
      this.setState((prevState) => ({
        pageDisplayOptions: {
          ...prevState.pageDisplayOptions,
          [selectedPageHidden]: true,
          [nextPageHidden]: false,
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
          <Cart
            isCartHidden={this.state.pageDisplayOptions.isCartHidden}
            isShippingHidden={this.state.pageDisplayOptions.isShippingHidden}
            isPaymentHidden={this.state.pageDisplayOptions.isPaymentHidden}
            isConfirmationHidden={
              this.state.pageDisplayOptions.isConfirmationHidden
            }
            toNextPage={this.toNextPage}
          />
        </header>
      </div>
    );
  }
}

export default App;
