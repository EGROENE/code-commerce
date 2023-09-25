import React from "react";

class DropdownOption extends React.Component {
  render() {
    const { value, isSelected, fullName, valueAndTextAreDifferent } =
      this.props;
    return (
      <option selected={isSelected} value={value}>
        {valueAndTextAreDifferent ? fullName : value}
      </option>
    );
  }
}

export default DropdownOption;
