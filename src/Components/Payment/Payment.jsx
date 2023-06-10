import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Payment.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        cardNumberError: "",
        cardHolderNameError: "",
        expiryError: "",
        securityCodeError: "",
      },
      paymentDetails: {
        cardNumber: "",
        cardHolder: "",
        expiryDate: "",
        securityCode: "",
      },
    };
  }

  // Validation methods:

  render() {
    const {
      accountEmailAddress,
      itemsInCart,
      isPaymentHidden,
      completedPages,
      numberOfItemsInCart,
      discountRate,
      toNextPage,
      toPreviousPage,
      shipmentDetails,
      shippingAndHandling,
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

    return (
      <div id="paymentAndConfirmation">
        <div
          className={!isPaymentHidden ? "checkoutPageContainer" : undefined}
          hidden={isPaymentHidden}
        >
          <ProgressBar completedPages={completedPages} />
          <header className="pageHeader">Payment</header>
          <div className="checkoutPageMainItems">
            <form id={style.paymentForm}>
              <label htmlFor="">
                <header>Cardholder Name: </header>
                <input
                  type="text"
                  required
                  inputMode="text"
                  placeholder="Enter name as it appears on card"
                />
              </label>
              <label htmlFor="">
                <header>Card Number: </header>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="Enter card number"
                />
              </label>
              <div id={style.expiryAndCVV}>
                <label htmlFor="">
                  <header>Expiry Date: </header>
                  <select name="" id="">
                    <option disabled selected>
                      Month
                    </option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                  </select>
                  <select name="" id="">
                    <option disabled selected>
                      Year
                    </option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                    <option value="2030">2030</option>
                    <option value="2031">2031</option>
                    <option value="2032">2032</option>
                    <option value="2033">2033</option>
                    <option value="2034">2034</option>
                    <option value="2035">2035</option>
                    <option value="2036">2036</option>
                    <option value="2037">2037</option>
                    <option value="2038">2038</option>
                  </select>
                </label>
                <label htmlFor="">
                  <header>CVV:</header>
                  <input
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
                <div>
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
              </div>
            </form>
            <div className="cartSummary">
              <div className="cartSummaryHeaders">
                <header>Order Summary</header>
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
                          <p>Category: {item.category}</p>
                          <p>Language: {item.language}</p>
                          <p>Quantity: {item.quantity}</p>
                          <p>
                            <span className="itemInfoHeader">Item Total:</span>
                            {" $" +
                              roundToHundredth(
                                item.quantity * item.unitPrice
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
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
                    {" $" +
                      item.value.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
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
