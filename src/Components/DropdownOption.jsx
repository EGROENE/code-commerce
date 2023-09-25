import React from "react";

class DropdownOption extends React.Component {
  render() {
    const { value, isSelected, fullName } = this.props;
    return (
      <option selected={isSelected} value={value}>
        {fullName}
      </option>
    );
  }
}

export default DropdownOption;
