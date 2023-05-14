import React from "react";
import logo from "./new-logo.png";
import "./App.css";
import Login from "./Components/Login/Login";

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>codeCommerce</h1>
          <Login />
        </header>
      </div>
    );
  }
}

export default App;
