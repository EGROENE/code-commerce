import { cardRegexPatterns } from "./constants";

export const emailIsValid = (value) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value.trim()
  );
};

/* export function emailIsValid(value) {
  // eslint-disable-next-line no-useless-escape
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return !!value.match(regex);
} */

export const passwordIsValid = (value) => {
  return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,20}$/.test(
    value
  );
};

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

// If input of card number field matches any RegEx patterns of accepted cards, the card type (AmEx, Visa, etc.) is returned. If not, nothing is returned.
export const findDebitCardType = (cardNumber) => {
  for (const cardType in cardRegexPatterns) {
    if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[cardType])) {
      return cardType;
    }
  }
  return "";
};

// Check that card number is valid. Return error message if not.
export const cardNumberIsValid = (cardNumber) => {
  for (const card in cardRegexPatterns) {
    // Remove any empty spaces (chars that are not digits) in card number:
    if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[card])) {
      if (cardNumber) {
        return cardNumber &&
          /^[1-6]{1}[0-9]{14,15}$/i.test(
            cardNumber.replace(/[^\d]/g, "").trim()
          )
          ? true
          : false;
      }
    }
  }
  return false;
};

export const isMonthValid = (month, year) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (
    (+month <= currentMonth && +year === currentYear) ||
    (+year !== "" && +year < currentYear)
  ) {
    return false;
  } else {
    return true;
  }
};

export const isYearValid = (month, year) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (
    (+month !== "" && +month <= currentMonth && +year === currentYear) ||
    +year < currentYear
  ) {
    return false;
  } else {
    return true;
  }
};

export const cvvIsValid = (value) => {
  return /[0-9]$/i.test(value) && value.length === 3 ? true : false;
};
