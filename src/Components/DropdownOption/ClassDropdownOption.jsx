import React from "react";

class ClassDropdownOption extends React.Component {
  render() {
    const { value, fullName, valueAndTextAreDifferent } = this.props;
    return (
      <option value={value}>
        {valueAndTextAreDifferent ? fullName : value}
      </option>
    );
  }
}

export default ClassDropdownOption;
