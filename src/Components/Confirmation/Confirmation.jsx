import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Confirmation.module.css";
import { roundToHundredth } from "../../methods";

class Confirmation extends React.Component {
  /* showHideOrderDetails = () => {
    !this.state.isOrderSummaryDisplayed
      ? this.setState({ isOrderSummaryDisplayed: true })
      : this.setState({ isOrderSummaryDisplayed: false });
  }; */

  render() {
    // Destructure props:
    const {
      accountEmailAddress,
      arePagesComplete,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      shippingDetails,
      cardNumber,
      cardType,
      shippingAndHandling,
      deliveryTime,
      isOrderSummaryDisplayed,
      showHideOrderDetails,
    } = this.props;

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

    let lastDigitsOfCardNumber =
      cardType === "AMERICAN_EXPRESS"
        ? cardNumber.substr(cardNumber.length - 5)
        : cardNumber.substr(cardNumber.length - 4);

    return (
      <div className="checkoutPageContainer">
        <ProgressBar arePagesComplete={arePagesComplete} />
        <div id={style.confirmationMessageContainer}>
          <header>Thanks for your order!</header>
          <p>It should be arriving within {deliveryTime}.</p>
          <div id={style.confirmationPageBtnContainer}>
            <button>Back to Homepage</button>
            <button onClick={showHideOrderDetails}>See Order Details</button>
          </div>
        </div>
        <div
          id={style.modalContainer}
          onClick={isOrderSummaryDisplayed && showHideOrderDetails}
          style={
            isOrderSummaryDisplayed
              ? { display: "flex", position: "fixed" }
              : { display: "none", position: "unset" }
          }
        ></div>
        <div
          style={
            isOrderSummaryDisplayed ? { display: "block" } : { display: "none" }
          }
          id={style.orderSummaryContainer}
        >
          <i
            title="Close Order Summary"
            onClick={showHideOrderDetails}
            id={style.closeModalBtn}
            className="fas fa-times"
          ></i>
          <header id={style.modalHeader}>Order Details</header>
          <div id={style.orderItemsAndTotals}>
            <div
              id={style.itemsInCartContainer}
              style={
                numberOfItemsInCart > 2
                  ? { overflowY: "scroll" }
                  : { overflowY: "unset" }
              }
            >
              {itemsInCart.map(
                (item) =>
                  item.quantity > 0 && (
                    <div
                      key={item.itemNameCamelCase}
                      className={style.itemInOrderSummary}
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
            <div id={style.detailsContainer}>
              <div id={style.orderTotalsContainer}>
                <header>Cart Totals:</header>
                {summaryTotals.map((total) => (
                  <p key={total.label}>
                    {total.label} $
                    {total.value.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                ))}
              </div>
              <div id={style.ordershippingDetails}>
                <header>Delivering To:</header>
                <p>
                  {shippingDetails.title !== "" && shippingDetails.title}{" "}
                  {shippingDetails.name}
                </p>
                <p>Card ending in {lastDigitsOfCardNumber}</p>
                <p>{shippingDetails.streetAddress}</p>
                <p>
                  {shippingDetails.city}, {shippingDetails.stateOrTerritory}{" "}
                  {shippingDetails.postalCode}
                </p>
                <p>Phone: {shippingDetails.phoneNumberMask}</p>
                <p>E-mail: {accountEmailAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirmation;
