import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Login from "./Components/Login/Login";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginHidden: false,
      isCartHidden: true,
      isShippingHidden: true,
      isDeliveryHidden: true,
      isConfirmationHidden: true,
    };
  }

  // Method to move to next page:

  // Method to go to previous page:

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>codeCommerce</h1>
          <Login isLoginHidden={this.state.isLoginHidden} />
        </header>
      </div>
    );
  }
}

export default App;
