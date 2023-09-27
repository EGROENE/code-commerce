/* export const isEmailValid = (value) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value.trim()
  );
}; */

export function isEmailValid(value) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return !!value.match(regex);
}

export const postalCodeIsValid = (value) => {
  return /[0-9]$/i.test(value) && value.length === 5;
};

export const nameOrCityIsValid = (name) => {
  if (
    /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -.]*$/i.test(name) &&
    name.replace(/\s/g, "").length &&
    name.replace(/\./g, "").length &&
    name.replace(/'/g, "").length &&
    name.replace(/\^/g, "").length &&
    name.replace(/%/g, "").length &&
    name.replace(/\*/g, "").length &&
    name.replace(/\(/g, "").length &&
    name.replace(/\)/g, "").length &&
    name.replace(/!/g, "").length &&
    name.replace(/-/g, "").length
  ) {
    return true;
  } else {
    return false;
  }
};

export const streetAddressIsValid = (value) => {
  if (
    /[A-Z0-9#/ '-]+/i.test(value) &&
    value.replace(/\s/g, "").length &&
    value.replace(/'/g, "").length &&
    value.replace(/-/g, "").length
  ) {
    return true;
  } else {
    return false;
  }
};

export const phoneNumberIsValid = (value) => {
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i.test(value);
};
