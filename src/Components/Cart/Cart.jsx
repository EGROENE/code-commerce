import React from "react";
import style from "./Cart.module.css";
import { ITEMS_IN_CART } from "../../Constants/itemsAddedToCart.js";
import { roundToHundredth } from "../../methods";
import Shipping from "../Shipping/Shipping.jsx";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsInCart: ITEMS_IN_CART,
      promoCodes: [
        "ilikebeachballs",
        "codeislyfe",
        "devslopes",
        "jd911",
        "etlb17",
      ],
      inputPromoCode: "",
      acceptedPromoCode: "",
      discountRate: 0,
    };
  }

  // Method to update item quantities state values onChange of quantity field:
  updateQuantities = (e, itemNameCamelCase) => {
    let newQuantity = Number(e.target.value.trim());
    let selectedItem = this.state.itemsInCart.filter((item) => {
      return item.itemNameCamelCase === itemNameCamelCase;
    })[0];

    let selectedItemIndex = this.state.itemsInCart.indexOf(selectedItem);

    this.setState((prevState) => ({
      ...prevState,
      itemsInCart: prevState.itemsInCart.map((item) =>
        this.state.itemsInCart.indexOf(item) === selectedItemIndex
          ? { ...item, quantity: newQuantity }
          : item
      ),
    }));
  };

  // Method to delete item from cart:
  deleteItem = (e, itemNameCamelCase) => {
    let itemToDelete = this.state.itemsInCart.filter((item) => {
      return item.itemNameCamelCase === itemNameCamelCase;
    })[0];

    let itemToDeleteIndex = this.state.itemsInCart.indexOf(itemToDelete);

    this.setState((prevState) => ({
      ...prevState,
      // If passed-in itemToDeleteIndex is equal to the index of that item in this.state.itemsInCart array, set the previous state values of that object, but change the quantity to 0. If indices are not equal, then item does not change.
      itemsInCart: prevState.itemsInCart.map((item) =>
        this.state.itemsInCart.indexOf(item) === itemToDeleteIndex
          ? { ...item, quantity: 0 }
          : item
      ),
    }));
  };

  // Method that checks if all item.quantities are zero (no items in cart)
  isCartEmpty = () => {
    let allItemQuantities = this.state.itemsInCart.map((item) => item.quantity);
    return allItemQuantities.some((quantity) => quantity > 0) ? false : true;
  };

  // Set state value inputPromoCode to what user inputs:
  getPromoCode = (e) => {
    let inputCode = e.target.value.trim().trim().toLowerCase();
    this.setState((prevState) => ({
      ...prevState,
      inputPromoCode: inputCode,
    }));
  };

  // Check input promo code to see if it matches an available promo, then apply appropriate discount:
  checkPromoCode = () => {
    let inputPromoCode = this.state.inputPromoCode;
    if (this.state.promoCodes.includes(inputPromoCode)) {
      if (inputPromoCode === "ilikebeachballs") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.1,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "codeislyfe") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.25,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "devslopes") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.5,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "jd911") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.75,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "etlb17") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discountRate: 0.99,
          isInvalidPromo: false,
        }));
      }
    } else {
      this.setState((prevState) => ({
        ...prevState,
        discountRate: 0,
        isInvalidPromo: true,
      }));
    }
  };

  // Method to remove discount:
  removeDiscount = () => {
    this.setState((prevState) => ({
      ...prevState,
      discountRate: 0,
      isInvalidPromo: false,
    }));
  };

  render() {
    const {
      isCartHidden,
      isShippingHidden,
      isPaymentHidden,
      isConfirmationHidden,
      toNextPage,
    } = this.props;
    // Calculate totals based on current state values of unit prices & quantity:
    let cartSubtotal = this.state.itemsInCart.map(
      (item) => item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));

    let cartTotal = roundToHundredth(
      cartSubtotal - cartSubtotal * this.state.discountRate
    );

    return (
      <div id="checkout">
        <div hidden={isCartHidden}>
          <header className="pageHeader">Cart</header>
          <div id={style.cartPageContainer}>
            <div id={style.itemsInCart}>
              {this.isCartEmpty() ? (
                <p id={style.cartIsEmpty}>Cart is empty</p>
              ) : (
                this.state.itemsInCart.map(
                  (item) =>
                    item.quantity > 0 && (
                      <div
                        id={item.itemNameCamelCase}
                        className={style.itemInCart}
                      >
                        <p
                          className={style.deleteItemButton}
                          title="Remove from cart"
                        >
                          <i
                            onClick={(e) => {
                              this.deleteItem(e, item.itemNameCamelCase);
                            }}
                            className="fas fa-times-circle"
                          ></i>
                        </p>
                        <img alt="" src={item.itemImage} />
                        <div className={style.itemInfo}>
                          <p className={style.productTitle}>{item.itemName}</p>
                          <p>Category: {item.category}</p>
                          <p>Language: {item.language}</p>
                        </div>
                        <p>
                          <span className={style.itemInfoHeader}>
                            Unit Price:
                          </span>
                          <br />
                          {" $" +
                            item.unitPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                        </p>
                        <input
                          value={item.quantity}
                          type="number"
                          min={1}
                          step={1}
                          onChange={(e) => {
                            this.updateQuantities(e, item.itemNameCamelCase);
                          }}
                        />
                        <p>
                          <span className={style.itemInfoHeader}>
                            Item Total:
                          </span>
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
                    )
                )
              )}
            </div>
            <div id={style.cartSummary}>
              <header>Cart Summary</header>
              <label htmlFor="">
                <p>Do you have a promo code?</p>
                <input
                  placeholder="Enter promo code"
                  disabled={this.state.discountRate > 0 || this.isCartEmpty()}
                  onChange={(e) => {
                    this.getPromoCode(e);
                  }}
                  type="text"
                />
                {this.state.isInvalidPromo && <p>Invalid code</p>}
                <button
                  disabled={this.state.discountRate > 0}
                  title="Apply promo code"
                  onClick={this.checkPromoCode}
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
              <p>Shipping & Handling: -</p>
              <p>
                Discount:
                {" $" +
                  (cartSubtotal * this.state.discountRate).toLocaleString(
                    undefined,
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
              </p>
              {this.state.discountRate > 0 && (
                <p className={style.acceptedPromoCode}>
                  {this.state.acceptedPromoCode}
                  <i
                    onClick={this.removeDiscount}
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
                disabled={this.isCartEmpty()}
                onClick={(e) => {
                  toNextPage(e, "isCartHidden", "isShippingHidden");
                }}
                id="toNextPageBtn"
              >
                To Shipping
              </button>
            </div>
          </div>
        </div>
        <Shipping
          itemsInCart={this.state.itemsInCart}
          discountRate={this.state.discountRate}
          isShippingHidden={isShippingHidden}
          toNextPage={toNextPage}
        />
      </div>
    );
  }
}

export default Cart;
