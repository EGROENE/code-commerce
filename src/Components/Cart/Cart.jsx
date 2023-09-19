import React from "react";
import style from "./Cart.module.css";
//import { ITEMS_IN_CART } from "../../constants";
import { roundToHundredth } from "../../methods";

class Cart extends React.Component {
  render() {
    // Destructure props:
    const {
      toNextPage,
      updateQuantities,
      deleteItem,
      cartIsEmpty,
      getPromoCode,
      checkPromoCode,
      removeDiscount,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      isInvalidPromo,
      acceptedPromoCode,
    } = this.props;

    // Calculate totals based on current state values of unit prices & quantity:
    let cartSubtotal = itemsInCart.map(
      (item) => item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));

    let cartTotal = roundToHundredth(
      cartSubtotal - cartSubtotal * discountRate
    );

    return (
      <div id="cartAndShipping">
        <div>
          <header className="pageHeader">Cart</header>
          <div id={style.cartPageContainer}>
            <div
              id={
                numberOfItemsInCart > 2
                  ? style.itemsInCartSeveral
                  : style.itemsInCartCouple
              }
            >
              {cartIsEmpty() ? (
                <p id={style.cartIsEmpty}>Cart is empty</p>
              ) : (
                itemsInCart.map(
                  (item) =>
                    item.quantity > 0 && (
                      <div
                        id={item.itemNameCamelCase}
                        className={style.itemInCart}
                        key={item.itemNameCamelCase}
                      >
                        <div className={style.itemMainInfoContainer}>
                          <p
                            className={style.deleteItemButton}
                            title="Remove from cart"
                          >
                            <i
                              onClick={(e) => {
                                deleteItem(e, item.itemNameCamelCase);
                              }}
                              className="fas fa-times-circle"
                            ></i>
                          </p>
                          <img alt="" src={item.itemImage} />
                          <div className={style.itemInfo}>
                            <p className={style.productTitle}>
                              {item.itemName}
                            </p>
                            <p>Category: {item.category}</p>
                            <p>Language: {item.language}</p>
                          </div>
                        </div>
                        <div className={style.itemTotalsContainer}>
                          <p>
                            <span className="itemInfoHeader">Unit Price:</span>
                            <br />
                            {" $" +
                              item.unitPrice.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </p>
                          <input
                            id={`${item.itemNameCamelCase}Quantity`}
                            value={item.quantity}
                            type="number"
                            min={1}
                            step={1}
                            onChange={(e) => {
                              updateQuantities(e, item.itemNameCamelCase);
                            }}
                          />
                          <p>
                            <span className="itemInfoHeader">Item Total:</span>
                            <br />
                            {"$" +
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
                )
              )}
            </div>
            <div id={style.cartSummary}>
              <header>Cart Summary</header>
              <label>
                <p>Do you have a promo code?</p>
                <input
                  placeholder="Enter promo code"
                  disabled={discountRate > 0 || cartIsEmpty()}
                  onChange={(e) => {
                    getPromoCode(e);
                  }}
                  type="text"
                  inputMode="text"
                  id="promoCode"
                />
                {isInvalidPromo && <p>Invalid code</p>}
                <button
                  disabled={discountRate > 0}
                  title="Apply promo code"
                  onClick={checkPromoCode}
                  id={style.applyPromo}
                >
                  Apply
                </button>
              </label>
              <p>
                Cart Subtotal:
                {" $" +
                  cartSubtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
              <p>Shipping & Handling: TBD</p>
              <p>
                Discount:
                {" $" +
                  (cartSubtotal * discountRate).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
              {discountRate > 0 && (
                <p className={style.acceptedPromoCode}>
                  {acceptedPromoCode}
                  <i
                    onClick={removeDiscount}
                    title="Remove discount"
                    className="fas fa-times"
                  ></i>
                </p>
              )}
              <p>
                Cart Total:
                {" $" +
                  cartTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
              <button
                title="To Shipping"
                disabled={cartIsEmpty()}
                onClick={(e) => {
                  toNextPage(e, "Cart");
                }}
                id="toNextPageBtn"
              >
                To Shipping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
