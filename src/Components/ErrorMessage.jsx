import React from "react";

class ErrorMessage extends React.Component {
  render() {
    const { message, id } = this.props;
    return <p id={id}>{message}</p>;
  }
}

export default ErrorMessage;
