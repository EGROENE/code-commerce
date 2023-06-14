import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Payment.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";
import { cardImages, cardRegexPatterns } from "../../constants";

let currentMonth = new Date().getMonth() + 1;
let currentYear = new Date().getFullYear();

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        cardNumberError: "",
        cardHolderError: "",
        expiryError: "",
        securityCodeError: "",
      },
      paymentDetails: {
        cardType: "",
        cardHolder: "",
        cardNumber: "",
        cardNumberMask: "",
        expiryMonth: "",
        expiryYear: "",
        securityCode: "",
        cardImage: "",
      },
    };
  }

  // Validation methods:
  validateCardHolderName = (e) => {
    let value = e.target.value.trim();
    if (/^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value)) {
      console.log("valid ");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          cardHolderError: "",
        },
        details: {
          ...prevState.details,
          cardHolder: value,
        },
      }));
    } else {
      console.log("invalid");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          cardHolderError: "Enter only alphabetic characters (and any hyphens)",
        },
        details: {
          ...prevState.details,
          cardHolder: "",
        },
      }));
    }
  };

  // If input of card number field matches any RegEx patterns of accepted cards, the card type (AmEx, Visa, etc.) is returned. If not, nothing is returned.
  findDebitCardType = (cardNumber) => {
    for (const cardType in cardRegexPatterns) {
      if (cardNumber.replace(/[^\d]/g, "").match(cardRegexPatterns[cardType])) {
        return cardType;
      }
    }
    return "";
  };

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

  validateCardNumber = (e) => {
    let value = e.target.value.trim();
    let errorText = this.checkCardNumberError(value);
    let cardType = this.findDebitCardType(value);
    let mask = value.split(" ").join("");
    // If any input...
    if (mask.length) {
      // Add space after every fourth character:
      mask = mask.match(new RegExp(".{1,4}", "g")).join(" ");
      // Set appropriate state values:
      this.setState((prevState) => ({
        paymentDetails: {
          ...prevState.paymentDetails,
          cardNumberMask: mask,
          cardNumber: value.replace(/\s/g, ""),
          cardType: cardType,
          cardImage: cardImages[cardType],
        },
        errors: {
          ...prevState.errors,
          cardNumberError: errorText,
        },
      }));
      // If no input, reset appropriate state values:
    } else {
      this.setState((prevState) => ({
        paymentDetails: {
          ...prevState.paymentDetails,
          cardNumberMask: "",
          cardNumber: "",
          cardType: "",
          cardImage: "",
        },
        errors: {
          ...prevState.errors,
          cardNumberError: "",
        },
      }));
    }
  };

  getExpiryMonth = (e) => {
    let value = e.target.value;
    if (
      (+value <= currentMonth &&
        +this.state.paymentDetails.expiryYear === currentYear) ||
      (+this.state.paymentDetails.expiryYear !== 0 &&
        +this.state.paymentDetails.expiryYear < currentYear)
    ) {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryMonth: value,
        },
        errors: {
          ...prevState.errors,
          expiryError: "Invalid date",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryMonth: value,
        },
        errors: {
          ...prevState.errors,
          expiryError: "",
        },
      }));
    }
  };

  getExpiryYear = (e) => {
    let value = e.target.value;
    if (
      (+this.state.paymentDetails.expiryMonth !== "" &&
        +this.state.paymentDetails.expiryMonth <= currentMonth &&
        +value === currentYear) ||
      +value < currentYear
    ) {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryYear: value,
        },
        errors: {
          ...prevState.errors,
          expiryError: "Invalid date",
        },
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        paymentDetails: {
          ...prevState.paymentDetails,
          expiryYear: value,
        },
        errors: {
          ...prevState.errors,
          expiryError: "",
        },
      }));
    }
  };

  render() {
    const {
      accountEmailAddress,
      itemsInCart,
      isPaymentHidden,
      completedPages,
      isShippingCompleted,
      numberOfItemsInCart,
      discountRate,
      toNextPage,
      toPreviousPage,
      shipmentDetails,
      shippingAndHandling,
      deliveryTime,
    } = this.props;

    // Calculate totals based on current state values of unit prices & quantity:
    let cartSubtotal = itemsInCart.map(
      (item) => item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));

    let discount = roundToHundredth(cartSubtotal * discountRate);

    let cartTotal = cartSubtotal - discount + shippingAndHandling;

    const summaryTotals = [
      { label: "Cart Subtotal:", value: cartSubtotal },
      { label: "Discount:", value: discount },
      { label: "Shipping & Handling:", value: shippingAndHandling },
      { label: "Cart Total:", value: cartTotal },
    ];

    const shipmentDetailsArray = Array.from(shipmentDetails);

    let areNoErrors = Object.values(this.state.errors).every(
      (element) => element === ""
    );

    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const years = [
      "2023",
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
      "2029",
      "2030",
      "2031",
      "2032",
      "2033",
      "2034",
      "2035",
      "2036",
      "2037",
      "2038",
      "2039",
      "2040",
      "2041",
      "2042",
      "2043",
      "2044",
      "2045",
      "2046",
      "2047",
      "2048",
      "2049",
      "2050",
    ];

    return (
      <div id="paymentAndConfirmation">
        <div
          className={!isPaymentHidden ? "checkoutPageContainer" : undefined}
          hidden={isPaymentHidden}
        >
          <ProgressBar
            completedPages={completedPages}
            isShippingCompleted={isShippingCompleted}
          />
          <header className="pageHeader">Payment</header>
          <div className="checkoutPageMainItems">
            <form id={style.paymentForm}>
              <label htmlFor="">
                <header>Cardholder Name: </header>
                <input
                  minLength="1"
                  onChange={this.validateCardHolderName}
                  type="text"
                  required
                  inputMode="text"
                  placeholder="Enter name as it appears on card"
                />
                {this.state.errors.cardHolderError && (
                  <p>{this.state.errors.cardHolderError}</p>
                )}
              </label>
              <label htmlFor="">
                <header>
                  Card Number:{" "}
                  <span>MasterCard, American Express, Visa, or Discover</span>
                </header>
                <input
                  onChange={this.validateCardNumber}
                  type="text"
                  required
                  inputMode="numeric"
                  value={
                    this.state.paymentDetails.cardNumberMask !== ""
                      ? this.state.paymentDetails.cardNumberMask
                      : ""
                  }
                  placeholder="Enter card number"
                  minLength={
                    this.state.paymentDetails.cardType === "AMERICAN_EXPRESS"
                      ? 18
                      : 19
                  }
                  maxLength={
                    this.state.paymentDetails.cardType === "AMERICAN_EXPRESS"
                      ? 18
                      : 19
                  }
                />
                {this.state.paymentDetails.cardType !== "" && (
                  <img
                    className={style.cardImage}
                    src={this.state.paymentDetails.cardImage}
                    alt="card"
                  />
                )}
                {this.state.errors.cardNumberError && (
                  <p>{this.state.errors.cardNumberError}</p>
                )}
              </label>
              <div id={style.expiryAndCVV}>
                <label htmlFor="">
                  <header>Expiry Date: </header>
                  <select id="selectExpiryMonth" onChange={this.getExpiryMonth}>
                    <option disabled selected>
                      Month
                    </option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select id="selectExpiryYear" onChange={this.getExpiryYear}>
                    <option disabled selected>
                      Year
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {this.state.errors.expiryError && (
                    <p>{this.state.errors.expiryError}</p>
                  )}
                </label>
                <label htmlFor="">
                  <header>CVV:</header>
                  <input
                    minLength="3"
                    maxLength="3"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="3-digit CVV code"
                  />
                </label>
              </div>
              <div className="checkoutBackNextBtnContainer">
                <button
                  title="Back to Shipping"
                  onClick={(e) => {
                    toPreviousPage(e, "isShippingHidden", "isPaymentHidden");
                  }}
                >
                  Back to Shipping
                </button>
                <button title="Pay & Place Order">
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
                    {shipmentDetails.title !== "" && shipmentDetails.title}{" "}
                    {shipmentDetails.name}
                  </p>
                  <div>
                    <p>{shipmentDetails.streetAddress}</p>
                    <p>
                      {shipmentDetails.city}, {shipmentDetails.stateOrTerritory}{" "}
                      {shipmentDetails.postalCode}
                    </p>
                  </div>
                  <div>
                    <p>Phone: {shipmentDetails.phoneNumber}</p>
                    <p>E-mail: {accountEmailAddress}</p>
                  </div>
                </div>
                <p>- Delivery within {deliveryTime} of placing order -</p>
              </div>
            </form>
            <div className="cartSummary">
              <div className="cartSummaryHeaders">
                <header>Order Summary:</header>
                {numberOfItemsInCart === 1 ? (
                  <p>{numberOfItemsInCart} item in cart</p>
                ) : (
                  <p>{numberOfItemsInCart} items in cart</p>
                )}
              </div>
              <div>
                {itemsInCart.map(
                  (item) =>
                    item.quantity > 0 && (
                      <div className="itemInCartSummary">
                        <img src={item.itemImage} alt="Item" />
                        <div className={style.itemDetailsShippingPage}>
                          <p>{item.itemName}</p>
                          <p>
                            Category: <span>{item.category}</span>
                          </p>
                          <p>
                            Language: <span>{item.language}</span>
                          </p>
                          <p>
                            Quantity: <span>{item.quantity}</span>
                          </p>
                          <p className="itemInfoHeader">
                            Item Total:
                            <span>
                              {" $" +
                                roundToHundredth(
                                  item.quantity * item.unitPrice
                                ).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                            </span>
                          </p>
                        </div>
                      </div>
                    )
                )}
              </div>
              <div className="cartSummaryItem">
                {summaryTotals.map((item) => (
                  <p>
                    {item.label}
                    <span>
                      {" $" +
                        item.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Payment;
