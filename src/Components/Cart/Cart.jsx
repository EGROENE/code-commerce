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

  // Check input in promo code box to see if it matches an available promo. Update prices accordingly.
  // Should set discount value in state and change cartTotal if match.
  // Call onClick of apply button.
  checkPromoCode = (e) => {};

  render() {
    const { isCartHidden } = this.props;
    // Calculate totals based on state values of unit prices & quantity
    // Could put these calcs into function(s), which could be defined in separate doc then imported to all components that require them.
    let cartSubtotal = this.state.itemsInCart.map(
      (item) =>
        //roundToHundredth(item.unitPrice * item.quantity)
        item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));

    let cartTotal = roundToHundredth(cartSubtotal - this.state.discount);
    return (
      <div hidden={isCartHidden}>
        <h1>Cart</h1>
        <div id="cartPageContainer">
          <div id={style.itemsInCart}>
            {this.state.itemsInCart.map((item) => (
              <div id={item.itemNameCamelCase} className={style.itemInCart}>
                <p>
                  <i class="fas fa-times-circle"></i>
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
            ))}
          </div>
          <div id="cartSummary">
            <header>Cart Summary</header>
            <label htmlFor="">
              <p>Do you have a promo code?</p>
              <input type="text" />
              <button id={style.applyPromo}>Apply</button>
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
            <p>Discount: {this.state.discount}</p>
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
