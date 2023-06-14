import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Login from "./Components/Login/Login";

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
      completedPages: {
        cart: false,
        shipping: false,
        payment: false,
        confirmation: false,
      },
    };
  }

  // Method to move to next page:
  toNextPage = (e, selectedPageHidden, nextPageHidden) => {
    e.preventDefault();

    if (!this.state.pageDisplayOptions[selectedPageHidden]) {
      if (selectedPageHidden === "isCartHidden") {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [selectedPageHidden]: true,
            [nextPageHidden]: false,
          },
          completedPages: {
            ...prevState.completedPages,
            cart: true,
          },
        }));
      } else if (selectedPageHidden === "isShippingHidden") {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [selectedPageHidden]: true,
            [nextPageHidden]: false,
          },
        }));
      } else if (selectedPageHidden === "isPaymentHidden") {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [selectedPageHidden]: true,
            [nextPageHidden]: false,
          },
        }));
      } else {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [selectedPageHidden]: true,
            [nextPageHidden]: false,
          },
        }));
      }
    }
  };

  // Method to go to previous page:
  toPreviousPage = (e, previousPageHidden, selectedPageHidden) => {
    e.preventDefault();

    if (!this.state.pageDisplayOptions[selectedPageHidden]) {
      if (selectedPageHidden === "isCartHidden") {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [previousPageHidden]: false,
            [selectedPageHidden]: true,
          },
        }));
      } else if (selectedPageHidden === "isShippingHidden") {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [previousPageHidden]: false,
            [selectedPageHidden]: true,
          },
        }));
      } else if (selectedPageHidden === "isPaymentHidden") {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [previousPageHidden]: false,
            [selectedPageHidden]: true,
          },
        }));
      } else {
        this.setState((prevState) => ({
          pageDisplayOptions: {
            ...prevState.pageDisplayOptions,
            [previousPageHidden]: false,
            [selectedPageHidden]: true,
          },
        }));
      }
    }
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>codeCommerce</h1>
          <Login
            isLoginHidden={this.state.pageDisplayOptions.isLoginHidden}
            toNextPage={this.toNextPage}
            isCartHidden={this.state.pageDisplayOptions.isCartHidden}
            isShippingHidden={this.state.pageDisplayOptions.isShippingHidden}
            isPaymentHidden={this.state.pageDisplayOptions.isPaymentHidden}
            isConfirmationHidden={
              this.state.pageDisplayOptions.isConfirmationHidden
            }
            toPreviousPage={this.toPreviousPage}
            completedPages={this.state.completedPages}
          />
        </header>
      </div>
    );
  }
}

export default App;
