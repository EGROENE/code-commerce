import React from "react";

class DropdownOption extends React.Component {
  render() {
    const { value, fullName, valueAndTextAreDifferent } = this.props;
    return (
      <option value={value}>
        {valueAndTextAreDifferent ? fullName : value}
      </option>
    );
  }
}

export default DropdownOption;
