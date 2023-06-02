export const roundToHundredth = (val) => {
  const newVal = val.toFixed(3);
  if (newVal.charAt(newVal.length - 1) === "5") {
    return Number(Number(newVal + "1").toFixed(2));
  } else {
    return Number(Number(newVal).toFixed(2));
  }
};
export const alertShippingFormErrors = () => {
  alert("Please fix errors before proceeding to payment page.");
};
