import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Confirmation.module.css";
import { roundToHundredth } from "../../methods";

class Confirmation extends React.Component {
  showOrderDetails = () => {};

  render() {
    const {
      isConfirmationHidden,
      completedPages,
      accountEmailAddress,
      itemsInCart,
      isPaymentHidden,
      numberOfItemsInCart,
      discountRate,
      toNextPage,
      toPreviousPage,
      shipmentDetails,
      shippingAndHandling,
      deliveryTime,
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

    return (
      <div
        className={!isConfirmationHidden ? "checkoutPageContainer" : undefined}
        hidden={isConfirmationHidden}
      >
        <ProgressBar
          completedPages={completedPages}
          isShippingCompleted={!completedPages.shipping}
          isPaymentCompleted={!completedPages.payment}
          isConfirmationCompleted={!completedPages.confirmation}
        />
        <div id={style.confirmationMessageContainer}>
          <header>Thanks for your order!</header>
          <p>It should be arriving within {deliveryTime}.</p>
          <div id={style.confirmationPageBtnContainer}>
            <a href="">
              <button>Back to Homepage</button>
            </a>
            <button>See Order Details</button>
          </div>
        </div>
        <div id={style.orderDetailsContainer}>
          <header>Order Details</header>
          <div id={style.orderItemsAndTotals}>
            <div>
              {itemsInCart.map(
                (item) =>
                  item.quantity > 0 && (
                    <div className={style.itemInOrderSummary}>
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
            <div id={style.orderTotalsContainer}>
              <p>
                Cart Subtotal: $
                {cartSubtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {discount > 0 && (
                <p>
                  Discount: $
                  {discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              )}
              <p>
                Shipping & Handling: $
                {shippingAndHandling.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p>
                Total Paid: $
                {cartTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Confirmation;
