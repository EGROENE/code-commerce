import React from "react";
import style from "./Cart.module.css";
import { ITEMS_IN_CART } from "../../Constants/itemsAddedToCart.js";
import { roundToHundredth } from "../../methods";

class Cart extends React.Component {
  // Should addedItems array be here, then mapped through in init of state below?
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
      discount: 0,
    };
  }

  // Method to update item quantities onChange of quantity field:
  updateQuantities = (e, itemNameCamelCase) => {
    let newQuantity = Number(e.target.value);
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
  // On initial loading, only render items in cart whose quantity is over 0. This method should change that, so, upon re-rendering, the item whose delete btn was clicked will not display.
  deleteItem = (e, itemNameCamelCase) => {
    let itemToDelete = this.state.itemsInCart.filter((item) => {
      return item.itemNameCamelCase === itemNameCamelCase;
    })[0];

    let itemToDeleteIndex = this.state.itemsInCart.indexOf(itemToDelete);

    this.setState((prevState) => ({
      ...prevState,
      itemsInCart: prevState.itemsInCart.map((item) =>
        this.state.itemsInCart.indexOf(item) === itemToDeleteIndex
          ? { ...item, quantity: 0 }
          : item
      ),
    }));
  };

  // Method that checks if all item.quantities are zero (no items in cart)
  // If returns true, then display message saying there are no items in cart
  isCartEmpty = () => {
    let allItemQuantities = this.state.itemsInCart.map((item) => item.quantity);
    return allItemQuantities.some((quantity) => quantity > 0) ? false : true;
  };

  // Set state value inputPromoCode to what user inputs:
  getPromoCode = (e) => {
    let inputCode = e.target.value.trim().toLowerCase();
    this.setState((prevState) => ({
      ...prevState,
      inputPromoCode: inputCode,
    }));
  };

  // Check input promo code to see if it matches an available promo, then apply appropriate discount:
  checkPromoCode = (cartSubtotal) => {
    let inputPromoCode = this.state.inputPromoCode;
    if (this.state.promoCodes.includes(inputPromoCode)) {
      if (inputPromoCode === "ilikebeachballs") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discount: cartSubtotal * 0.1,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "codeislyfe") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discount: cartSubtotal * 0.25,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "devslopes") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discount: cartSubtotal * 0.5,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "jd911") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discount: cartSubtotal * 0.75,
          isInvalidPromo: false,
        }));
      } else if (inputPromoCode === "etlb17") {
        this.setState((prevState) => ({
          ...prevState,
          acceptedPromoCode: inputPromoCode,
          discount: cartSubtotal * 0.99,
          isInvalidPromo: false,
        }));
      }
    } else {
      this.setState((prevState) => ({
        ...prevState,
        discount: 0,
        isInvalidPromo: true,
      }));
    }
  };

  // Method to remove discount:
  removeDiscount = () => {
    this.setState((prevState) => ({
      ...prevState,
      discount: 0,
      isInvalidPromo: false,
    }));
  };

  render() {
    const { isCartHidden } = this.props;
    // Calculate totals based on state values of unit prices & quantity
    // Could put these calcs into function(s), which could be defined in separate doc then imported to all components that require them.
    let cartSubtotal = this.state.itemsInCart.map(
      (item) => item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));
    console.log(cartSubtotal);

    let cartTotal = roundToHundredth(cartSubtotal - this.state.discount);
    return (
      <div hidden={isCartHidden}>
        <h1>Cart</h1>
        <div id="cartPageContainer">
          <div id={style.itemsInCart}>
            {this.isCartEmpty() ? (
              <p>Cart is empty</p>
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
                        <p>{item.gender}</p>
                        <p>{item.itemName}</p>
                        <p>Color: {item.color}</p>
                        <p>Size: {item.size}</p>
                      </div>
                      <p>
                        {"$" +
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
          <div id="cartSummary">
            <header>Cart Summary</header>
            <label htmlFor="">
              <p>Do you have a promo code?</p>
              <input
                disabled={this.state.discount > 0}
                onChange={(e) => {
                  this.getPromoCode(e);
                }}
                type="text"
              />
              {this.state.isInvalidPromo && <p>Invalid code</p>}
              <button
                onClick={(e) => {
                  this.checkPromoCode(cartSubtotal);
                }}
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
                this.state.discount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              {this.state.discount > 0 && (
                <span className={style.acceptedPromoCode}>
                  {this.state.acceptedPromoCode}
                  <i
                    onClick={this.removeDiscount}
                    title="Remove discount"
                    className="fas fa-times"
                  ></i>
                </span>
              )}
            </p>
            <p>
              Cart Total:
              {" $" +
                cartTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
