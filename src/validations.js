/* export const isEmailValid = (value) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value.trim()
  );
}; */

export function isEmailValid(emailAddress) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return !!emailAddress.match(regex);
}

export const postalCodeIsValid = (postalCode) => {
  return /[0-9]$/i.test(postalCode) && postalCode.length === 5;
};

export const nameOrCityIsValid = (name) => {
  return (
    /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -.]*$/i.test(name) &&
    name.replace(/\s/g, "").length &&
    name.replace(/\./g, "").length &&
    name.replace(/'/g, "").length &&
    name.replace(/-/g, "").length
  );
};
