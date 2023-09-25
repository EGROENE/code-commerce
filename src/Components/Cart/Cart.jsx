import React from "react";
import style from "./Cart.module.css";
import { promoInfos } from "../../constants";
import { roundToHundredth } from "../../methods";

class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      inputPromoCode: "",
      acceptedPromoCode: "",
    };
  }

  render() {
    // Destructure props:
    const {
      toNextPage,
      setItemsAndNumberOfItemsInCart,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      setDiscountRate,
    } = this.props;

    // Calculate totals based on current state values of unit prices & quantity:
    const cartSubtotal = roundToHundredth(
      itemsInCart
        .map((item) => item.unitPrice * item.quantity)
        .reduce((a, b) => a + b)
    );

    const cartTotal = roundToHundredth(
      cartSubtotal - cartSubtotal * discountRate
    );

    // Runs in onChange of quantity input box of each item in cart
    const updateItemQuantities = (e, itemNameCamelCase) => {
      const newQuantity = Number(e.target.value.trim());
      const selectedItem = itemsInCart.filter((item) => {
        return item.itemNameCamelCase === itemNameCamelCase;
      })[0];

      const selectedItemIndex = itemsInCart.indexOf(selectedItem);

      // Prevent user from manually entering '0' or backspacing and deleting item quantities:
      if (newQuantity !== "" && newQuantity !== 0) {
        setItemsAndNumberOfItemsInCart(newQuantity, selectedItemIndex);
      }
    };

    // Runs onClick of 'X' button to left of each item in cart
    // Delete 'e' from params and thou shalt surely die...
    const deleteItem = (e, itemNameCamelCase) => {
      setItemsAndNumberOfItemsInCart(undefined, undefined, itemNameCamelCase);
    };

    // Method that checks if all item.quantities are zero (no items in cart)
    const cartIsEmpty = () => {
      const allItemQuantities = itemsInCart.map((item) => item.quantity);
      return allItemQuantities.some((quantity) => quantity > 0) ? false : true;
    };

    // Set state value inputPromoCode to what user inputs:
    // Needed so field and 'apply' btn don't automatically become disabled when user enters a valid code
    const setInputPromoCode = (e) => {
      const inputPromoCode = e.target.value.trim().toLowerCase();
      this.setState((prevState) => ({
        ...prevState,
        inputPromoCode: inputPromoCode,
      }));
    };

    // Check input promo code to see if it matches an available promo, then apply appropriate discount:
    const checkPromoCode = () => {
      // Returns object containing passed promo code, if it exists...
      const getMatchingPromo = (promoCode) =>
        promoInfos.find((promo) => promo.code === promoCode);

      const matchingPromo = getMatchingPromo(this.state.inputPromoCode);

      if (matchingPromo) {
        setDiscountRate(matchingPromo.discountRate);
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: this.state.inputPromoCode,
          isInvalidPromo: false,
        }));
      } else {
        setDiscountRate(0);
        this.setState((prevState) => ({
          ...prevState,
          isInvalidPromo: true,
        }));
      }
    };

    // Method to remove discount:
    const removeDiscount = () => {
      setDiscountRate(0);
      this.setState((prevState) => ({
        ...prevState,
        isInvalidPromo: false,
      }));
    };

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
                              updateItemQuantities(e, item.itemNameCamelCase);
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
                    setInputPromoCode(e);
                  }}
                  type="text"
                  inputMode="text"
                  id="promoCode"
                />
                {this.state.isInvalidPromo &&
                  this.state.inputPromoCode !== "" && <p>Invalid code</p>}
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
                  {this.state.acceptedPromoCode}
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
