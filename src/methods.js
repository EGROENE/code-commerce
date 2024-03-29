export const roundToHundredth = (val) => {
  const newVal = val.toFixed(3);
  if (newVal.charAt(newVal.length - 1) === "5") {
    return Number(Number(newVal + "1").toFixed(2));
  } else {
    return Number(Number(newVal).toFixed(2));
  }
};
export const alertFormErrors = () => {
  alert(
    "Please fix any errors & make sure all fields are complete & without errors before proceeding to the next page."
  );
};

export const formatPhoneNumber = (phoneNumberString) => {
  const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return undefined;
};

export const formatAmex = (inputNumber) => {
  const cleaned = ("" + inputNumber).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{4})(\d{6})(\d{5})$/);
  if (match) {
    return match[1] + " " + match[2] + " " + match[3];
  }
  return null;
};
