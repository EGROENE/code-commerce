import style from "./Payment.module.css";

// Child components
import FunctionalProgressBar from "../ProgressBar/FunctionalProgressBar";
import FunctionalDropdownOption from "../DropdownOption/FunctionalDropdownOption";
import FunctionalOrderSummary from "../OrderSummary/FunctionalOrderSummary";
import FunctionalErrorMessage from "../ErrorMessage/FunctionalErrorMessage";

import { cardImages, months, years } from "../../constants";
import { roundToHundredth, formatAmex } from "../../methods";
import {
  nameOrCityIsValid,
  cardNumberIsValid,
  findDebitCardType,
  isMonthValid,
  isYearValid,
  cvvIsValid,
} from "../../validations";

const FunctionalPayment = ({
  handleRejection,
  hasFailedSubmission,
  setOrderDetails,
  arePagesComplete,
  itemsInCart,
  numberOfItemsInCart,
  discountRate,
  toNextPage,
  toPreviousPage,
  shippingDetails,
  shippingAndHandling,
  deliveryTime,
  paymentDetails,
  accountEmail,
}) => {
  // Calculate totals based on current state values of unit prices & quantity:
  const cartSubtotal = roundToHundredth(
    itemsInCart
      .map((item) => item.unitPrice * item.quantity)
      .reduce((a, b) => a + b)
  );

  const discount = roundToHundredth(cartSubtotal * discountRate);

  const cartTotal = cartSubtotal - discount + shippingAndHandling;

  const summaryTotals = [
    { label: "Cart Subtotal:", value: cartSubtotal },
    { label: "Discount:", value: discount },
    { label: "Shipping & Handling:", value: shippingAndHandling },
    { label: "Cart Total:", value: cartTotal },
  ];

  const handleCardNumberInput = (e) => {
    const value = e.target.value.trim();
    const cardType = findDebitCardType(value);
    let mask = value.split(" ").join("");

    // If any input...
    if (mask.length) {
      if (cardType === "AMERICAN_EXPRESS") {
        mask = formatAmex(value);
      } else {
        // Add space after every fourth character:
        mask = mask.match(new RegExp(".{1,4}", "g")).join(" ");
      }
    }

    // Set appropriate state values:
    setOrderDetails("payment", "cardNumberMask", mask);
    setOrderDetails("payment", "cardNumber", value.replace(/\s/g, ""));
    setOrderDetails("payment", "cardType", cardType);
    setOrderDetails("payment", "cardImage", cardImages[cardType]);
  };

  const validators = {
    cardHolderIsValid: nameOrCityIsValid(paymentDetails.cardHolder),
    cardNumberIsValid: cardNumberIsValid(paymentDetails.cardNumber),
    monthIsValid: isMonthValid(
      paymentDetails.expiryMonth,
      paymentDetails.expiryYear
    ),
    yearIsValid: isYearValid(
      paymentDetails.expiryMonth,
      paymentDetails.expiryYear
    ),
    cvvIsValid: cvvIsValid(paymentDetails.securityCode),
  };

  const areNoErrors =
    Object.values(validators).every((validator) => validator === true) &&
    paymentDetails.expiryMonth !== "" &&
    paymentDetails.expiryYear !== "";

  return (
    <div id="paymentAndConfirmation">
      <div className="checkoutPageContainer">
        <FunctionalProgressBar arePagesComplete={arePagesComplete} />
        <header className="pageHeader">Payment</header>
        <div className="checkoutPageMainItems">
          <form
            id={style.paymentForm}
            onSubmit={(e) => {
              toNextPage(e, "Payment");
            }}
          >
            <label>
              <header>Cardholder Name: </header>
              <input
                className={
                  hasFailedSubmission &&
                  (!validators.cardHolderIsValid ||
                    paymentDetails.cardHolder === "")
                    ? "inputWhenError"
                    : undefined
                }
                value={paymentDetails.cardHolder}
                id="cardholderName"
                minLength="1"
                onChange={(e) => {
                  setOrderDetails("payment", "cardHolder", e.target.value);
                }}
                type="text"
                required
                inputMode="text"
                placeholder="Name on card"
                autoComplete="cc-name"
              />
              {hasFailedSubmission &&
                paymentDetails.cardHolder !== "" &&
                !validators.cardHolderIsValid && (
                  <FunctionalErrorMessage message="Enter name as it appears on card" />
                )}
            </label>
            <label>
              <header>
                Card Number:{" "}
                <span>MasterCard, American Express, Visa, or Discover</span>
              </header>
              <div className="inputFieldWithImage">
                <input
                  className={
                    hasFailedSubmission &&
                    (!validators.cardNumberIsValid ||
                      paymentDetails.cardNumber === "")
                      ? "inputWhenError"
                      : undefined
                  }
                  id="cardNumber"
                  onChange={handleCardNumberInput}
                  type="text"
                  required
                  inputMode="numeric"
                  value={
                    paymentDetails.cardNumberMask !== ""
                      ? paymentDetails.cardNumberMask
                      : ""
                  }
                  placeholder="Card number"
                  minLength={
                    paymentDetails.cardType === "AMERICAN_EXPRESS" ? 17 : 19
                  }
                  maxLength={
                    paymentDetails.cardType === "AMERICAN_EXPRESS" ? 17 : 19
                  }
                  autoComplete="cc-number"
                />
                {paymentDetails.cardType !== "" && (
                  <img
                    className={style.cardImage}
                    src={paymentDetails.cardImage}
                    alt="card"
                  />
                )}
              </div>
              {hasFailedSubmission &&
                paymentDetails.cardNumber !== "" &&
                !validators.cardNumberIsValid && (
                  <FunctionalErrorMessage message="Invalid card number" />
                )}
            </label>
            <div id={style.expiryAndCVV}>
              <label>
                <header>Expiry Date: </header>
                <select
                  className={
                    hasFailedSubmission &&
                    (paymentDetails.expiryMonth === "" ||
                      (paymentDetails.expiryMonth !== "" &&
                        paymentDetails.expiryYear !== "" &&
                        !validators.monthIsValid &&
                        !validators.yearIsValid))
                      ? "inputWhenError"
                      : undefined
                  }
                  id="selectExpiryMonth"
                  onChange={(e) =>
                    setOrderDetails("payment", "expiryMonth", e.target.value)
                  }
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <FunctionalDropdownOption key={month} value={month} />
                  ))}
                </select>
                <select
                  className={
                    hasFailedSubmission &&
                    (paymentDetails.expiryYear === "" ||
                      (paymentDetails.expiryMonth !== "" &&
                        paymentDetails.expiryYear !== "" &&
                        !validators.monthIsValid &&
                        !validators.yearIsValid))
                      ? "inputWhenError"
                      : undefined
                  }
                  id="selectExpiryYear"
                  onChange={(e) =>
                    setOrderDetails("payment", "expiryYear", e.target.value)
                  }
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <FunctionalDropdownOption key={year} value={year} />
                  ))}
                </select>
                {hasFailedSubmission &&
                  paymentDetails.expiryMonth !== "" &&
                  paymentDetails.expiryYear !== "" &&
                  !validators.monthIsValid &&
                  !validators.yearIsValid && (
                    <FunctionalErrorMessage message="Invalid date" />
                  )}
              </label>
              <label>
                <header>CVV:</header>
                <input
                  className={
                    hasFailedSubmission &&
                    (!validators.cvvIsValid ||
                      paymentDetails.securityCode === "")
                      ? "inputWhenError"
                      : undefined
                  }
                  id={style.securityCode}
                  onChange={(e) =>
                    setOrderDetails("payment", "securityCode", e.target.value)
                  }
                  minLength="3"
                  maxLength="3"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="3-digit CVV code"
                  value={paymentDetails.securityCode}
                  autoComplete="cc-csc"
                />
                {hasFailedSubmission &&
                  paymentDetails.securityCode !== "" &&
                  !validators.cvvIsValid && (
                    <FunctionalErrorMessage message="Invalid CVV" />
                  )}
              </label>
            </div>
            <div className="checkoutBackNextBtnContainer">
              <button
                title="Back to Shipping"
                onClick={(e) => {
                  toPreviousPage(e, "Payment", "Shipping");
                }}
              >
                Back to Shipping
              </button>
              <button
                title="Pay & Place Order"
                type={!areNoErrors ? "button" : "submit"}
                onClick={!areNoErrors ? handleRejection : undefined}
              >
                Pay $
                {cartTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </button>
            </div>
            <div id={style.deliveryInfoContainer}>
              <header>Delivery Information:</header>
              <div id={style.deliveryInfoContainerInfoColumns}>
                <p>
                  {shippingDetails.title !== "" && shippingDetails.title}{" "}
                  {shippingDetails.name}
                </p>
                <div>
                  <p>{shippingDetails.streetAddress}</p>
                  <p>
                    {shippingDetails.city}, {shippingDetails.stateOrTerritory}{" "}
                    {shippingDetails.postalCode}
                  </p>
                </div>
                <div>
                  <p>Phone: {shippingDetails.phoneNumberMask}</p>
                  <p>E-mail: {accountEmail}</p>
                </div>
              </div>
              <p>- Delivery within {deliveryTime} of placing order -</p>
            </div>
          </form>
          <FunctionalOrderSummary
            numberOfItemsInCart={numberOfItemsInCart}
            itemsInCart={itemsInCart}
            summaryTotals={summaryTotals}
          />
        </div>
      </div>
    </div>
  );
};

export default FunctionalPayment;
