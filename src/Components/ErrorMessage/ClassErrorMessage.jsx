import React from "react";

class ClassErrorMessage extends React.Component {
  render() {
    const { message, id } = this.props;
    return <p id={id}>{message}</p>;
  }
}

export default ClassErrorMessage;
