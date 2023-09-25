import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Payment.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";
import { cardRegexPatterns, cardImages, months, years } from "../../constants";
import DropdownOption from "../DropdownOption";
import OrderSummary from "../OrderSummary";

class Payment extends React.Component {
  constructor() {
    super();
    this.state = {
      paymentErrors: {
        cardNumberError: "",
        cardHolderError: "",
        expiryError: "",
        securityCodeError: "",
      },
    };
  }
  // If input of card number field matches any RegEx patterns of accepted cards, the card type (AmEx, Visa, etc.) is returned. If not, nothing is returned.
  findDebitCardType = (cardNumber) => {
    for (const cardType in cardRegexPatterns) {
      if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[cardType])) {
        return cardType;
      }
    }
    return "";
  };

  // Method to format AmEx numbers:
  formatAmex(inputNumber) {
    const cleaned = ("" + inputNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{4})(\d{6})(\d{5})$/);
    if (match) {
      return match[1] + " " + match[2] + " " + match[3];
    }
    return null;
  }

  // Check that card number is valid. Return error message if not.
  checkCardNumberError = (cardNumber) => {
    for (const card in cardRegexPatterns) {
      // Remove any empty spaces (chars that are not digits) in card number:
      if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[card])) {
        if (cardNumber) {
          return cardNumber &&
            /^[1-6]{1}[0-9]{14,15}$/i.test(
              cardNumber.replace(/[^\d]/g, "").trim()
            )
            ? ""
            : "Please enter a valid card number";
        }
      }
    }
    return "Please enter a valid card number";
  };

  render() {
    // Destructure props:
    const {
      setOrderDetails,
      nameOrCityIsValid,
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
      accountEmailAddress,
    } = this.props;

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

    const areNoErrors = Object.values(this.state.paymentErrors).every(
      (element) => element === ""
    );

    const validateCardNumber = (e) => {
      const value = e.target.value.trim();
      const errorText = this.checkCardNumberError(value);
      const cardType = this.findDebitCardType(value);
      let mask = value.split(" ").join("");
      // If any input...
      if (mask.length) {
        if (cardType === "AMERICAN_EXPRESS") {
          mask = this.formatAmex(value);
        } else {
          // Add space after every fourth character:
          mask = mask.match(new RegExp(".{1,4}", "g")).join(" ");
        }
        // Set appropriate state values:
        setOrderDetails("payment", "cardNumberMask", mask);
        setOrderDetails("payment", "cardNumber", value.replace(/\s/g, ""));
        setOrderDetails("payment", "cardType", cardType);
        setOrderDetails("payment", "cardImage", cardImages[cardType]);
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            cardNumberError: errorText,
          },
        }));
        // If no input, reset appropriate state values:
      } else {
        setOrderDetails("payment", "cardNumberMask", mask);
        setOrderDetails("payment", "cardNumber", value.replace(/\s/g, ""));
        setOrderDetails("payment", "cardType", cardType);
        setOrderDetails("payment", "cardImage", cardImages[cardType]);
        this.setState((prevState) => ({
          ...prevState,
          // USE setState IN PAYMENT.JSX FOR THIS
          paymentErrors: {
            ...prevState.paymentErrors,
            cardNumberError: "",
          },
        }));
      }
    };

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const getExpiryMonth = (e) => {
      const value = e.target.value;
      setOrderDetails("payment", "expiryMonth", value);
      if (
        (+value <= currentMonth &&
          +paymentDetails.expiryYear === currentYear) ||
        (+paymentDetails.expiryYear !== 0 &&
          +paymentDetails.expiryYear < currentYear)
      ) {
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            expiryError: "Invalid date",
          },
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            expiryError: "",
          },
        }));
      }
    };

    const getExpiryYear = (e) => {
      const value = e.target.value;
      setOrderDetails("payment", "expiryYear", value);
      if (
        (+paymentDetails.expiryMonth !== "" &&
          +paymentDetails.expiryMonth <= currentMonth &&
          +value === currentYear) ||
        +value < currentYear
      ) {
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            expiryError: "Invalid date",
          },
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            expiryError: "",
          },
        }));
      }
    };

    const validateCVV = (e) => {
      const value = e.target.value.trim();
      setOrderDetails("payment", "securityCode", value);
      if (/[0-9]$/i.test(value)) {
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            securityCodeError: "",
          },
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          paymentErrors: {
            ...prevState.paymentErrors,
            securityCodeError: "3-digit CVV (on card back)",
          },
        }));
      }
    };

    return (
      <div id="paymentAndConfirmation">
        <div className="checkoutPageContainer">
          <ProgressBar arePagesComplete={arePagesComplete} />
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
                  value={paymentDetails.cardHolder}
                  id="cardholderName"
                  minLength="1"
                  onChange={(e) => {
                    setOrderDetails("payment", "cardHolder", e.target.value);
                    if (nameOrCityIsValid(e.target.value)) {
                      this.setState((prevState) => ({
                        ...prevState,
                        paymentErrors: {
                          ...prevState.paymentErrors,
                          cardHolderError: "",
                        },
                      }));
                    } else {
                      this.setState((prevState) => ({
                        ...prevState,
                        paymentErrors: {
                          ...prevState.paymentErrors,
                          cardHolderError:
                            "Enter alphabetical characters & any spaces between words",
                        },
                      }));
                    }
                  }}
                  type="text"
                  required
                  inputMode="text"
                  placeholder="Name on card"
                  autoComplete="cc-name"
                />
                {this.state.paymentErrors.cardHolderError && (
                  <p>{this.state.paymentErrors.cardHolderError}</p>
                )}
              </label>
              <label>
                <header>
                  Card Number:{" "}
                  <span>MasterCard, American Express, Visa, or Discover</span>
                </header>
                <div className="inputFieldWithImage">
                  <input
                    id="cardNumber"
                    onChange={validateCardNumber}
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
                {this.state.paymentErrors.cardNumberError && (
                  <p>{this.state.paymentErrors.cardNumberError}</p>
                )}
              </label>
              <div id={style.expiryAndCVV}>
                <label>
                  <header>Expiry Date: </header>
                  <select id="selectExpiryMonth" onChange={getExpiryMonth}>
                    <option disabled selected>
                      Month
                    </option>
                    {months.map((month) => (
                      <DropdownOption key={month} value={month} />
                    ))}
                  </select>
                  <select id="selectExpiryYear" onChange={getExpiryYear}>
                    <option disabled selected>
                      Year
                    </option>
                    {years.map((year) => (
                      <DropdownOption key={year} value={year} />
                    ))}
                  </select>
                  {this.state.paymentErrors.expiryError && (
                    <p>{this.state.paymentErrors.expiryError}</p>
                  )}
                </label>
                <label>
                  <header>CVV:</header>
                  <input
                    id={style.securityCode}
                    onChange={validateCVV}
                    minLength="3"
                    maxLength="3"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="3-digit CVV code"
                    value={paymentDetails.securityCode}
                    autoComplete="cc-csc"
                  />
                  {this.state.paymentErrors.securityCodeError && (
                    <p>{this.state.paymentErrors.securityCodeError}</p>
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
                  type={
                    !areNoErrors ||
                    paymentDetails.expiryMonth === "" ||
                    paymentDetails.expiryYear === ""
                      ? "button"
                      : "submit"
                  }
                  onClick={
                    !areNoErrors ||
                    paymentDetails.expiryMonth === "" ||
                    paymentDetails.expiryYear === ""
                      ? alertFormErrors
                      : undefined
                  }
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
                    <p>E-mail: {accountEmailAddress}</p>
                  </div>
                </div>
                <p>- Delivery within {deliveryTime} of placing order -</p>
              </div>
            </form>
            <OrderSummary
              numberOfItemsInCart={numberOfItemsInCart}
              itemsInCart={itemsInCart}
              summaryTotals={summaryTotals}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Payment;
