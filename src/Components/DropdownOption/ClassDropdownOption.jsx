import React from "react";

class ClassDropdownOption extends React.Component {
  render() {
    const { value, fullName, valueAndTextAreDifferent, selected } = this.props;
    return (
      <option value={value} selected={selected}>
        {valueAndTextAreDifferent ? fullName : value}
      </option>
    );
  }
}

export default ClassDropdownOption;
