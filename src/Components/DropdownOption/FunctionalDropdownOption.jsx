const FunctionalDropdownOption = ({
  value,
  fullName,
  valueAndTextAreDifferent,
}) => {
  return (
    <option value={value}>{valueAndTextAreDifferent ? fullName : value}</option>
  );
};

export default FunctionalDropdownOption;
