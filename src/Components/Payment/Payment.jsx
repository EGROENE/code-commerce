import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Payment.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";

class Payment extends React.Component {
  render() {
    // Destructure props:
    const {
      arePagesComplete,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      toNextPage,
      toPreviousPage,
      shippingDetails,
      shippingAndHandling,
      deliveryTime,
      paymentErrors,
      validateCardHolderName,
      validateCardNumber,
      getExpiryMonth,
      getExpiryYear,
      validateCVV,
      paymentDetails,
      accountEmailAddress,
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

    let areNoErrors = Object.values(paymentErrors).every(
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
                  onChange={validateCardHolderName}
                  type="text"
                  required
                  inputMode="text"
                  placeholder="Name on card"
                  autoComplete="cc-name"
                />
                {paymentErrors.cardHolderError && (
                  <p>{paymentErrors.cardHolderError}</p>
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
                {paymentErrors.cardNumberError && (
                  <p>{paymentErrors.cardNumberError}</p>
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
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select id="selectExpiryYear" onChange={getExpiryYear}>
                    <option disabled selected>
                      Year
                    </option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {paymentErrors.expiryError && (
                    <p>{paymentErrors.expiryError}</p>
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
                  {paymentErrors.securityCodeError && (
                    <p>{paymentErrors.securityCodeError}</p>
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
            <div className="cartSummary">
              <div className="cartSummaryHeaders">
                <header>Order Summary:</header>
                {numberOfItemsInCart === 1 ? (
                  <p>{numberOfItemsInCart} item in cart</p>
                ) : (
                  <p>{numberOfItemsInCart} items in cart</p>
                )}
              </div>
              <div
                id={
                  numberOfItemsInCart > 2
                    ? style.itemsInCartSummarySeveral
                    : undefined
                }
              >
                <div id={style.itemsContainer}>
                  {itemsInCart.map(
                    (item) =>
                      item.quantity > 0 && (
                        <div
                          key={item.itemNameCamelCase}
                          className="itemInCartSummary"
                        >
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
              </div>
              <div className="cartSummaryItem">
                {summaryTotals.map((item) => (
                  <p key={item.label}>
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
