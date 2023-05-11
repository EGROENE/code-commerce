import logo from "./new-logo.png";
import "./App.css";
import Login from "./Components/Login/Login";

function App() {
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

export default App;
