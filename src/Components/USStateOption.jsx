import React from "react";

class USStateOption extends React.Component {
  render() {
    const { value, isSelected, fullName } = this.props;
    return (
      <option selected={isSelected} value={value}>
        {fullName}
      </option>
    );
  }
}

export default USStateOption;
