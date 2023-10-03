const FunctionalDropdownOption = ({
  value,
  fullName,
  valueAndTextAreDifferent,
  selected,
}) => {
  return (
    <option value={value} selected={selected}>
      {valueAndTextAreDifferent ? fullName : value}
    </option>
  );
};

export default FunctionalDropdownOption;
