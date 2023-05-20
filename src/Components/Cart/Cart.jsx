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
    };
  }

  componentDidMount = () => {
    console.log(this.state.itemsInCart);
    console.log(this.state.itemsInCart[0]);
    console.log(this.state.itemsInCart[1]);
    /* const itemsInCartWithQuantity = [...this.state.itemsInCart].map((item) => ({
      ...item,
      quantity: 1,
    }));
    console.log(itemsInCartWithQuantity);
    this.setState({ itemsInCart: itemsInCartWithQuantity }); */
  };

  // Method to update prices onChange of quantity field:
  // Also set state value of item's quantity to what is in the field:
  updatePrices = (e, itemNameCamelCase) => {
    let newQuantity = Number(e.target.value);
    let selectedItem = this.state.itemsInCart.filter((item) => {
      return item.itemNameCamelCase === itemNameCamelCase;
    })[0];

    let selectedItemIndex = this.state.itemsInCart.indexOf(selectedItem);
    console.log(this.state.itemsInCart[selectedItemIndex]);

    this.setState((prevState) => ({
      ...prevState,
      itemsInCart: prevState.itemsInCart.map((item) =>
        this.state.itemsInCart.indexOf(item) === selectedItemIndex
          ? { ...item, quantity: newQuantity }
          : item
      ),
    }));
  };

  // Method to update prices.
  // Update item quantity state values.
  // Called onChange of quantity field:
  updateItemQuantityPriceCartTotals = (e, item, itemName) => {};

  // Method to update cart totals:
  // Also call on change of quantity field.
  updateTotals = () => {};

  // Check input in promo code box to see if it matches an available promo. Update prices accordingly.
  // Should set discount value in state and change cartTotal if match.
  // Call onClick of apply button.
  checkPromoCode = (e) => {};

  render() {
    const { isCartHidden } = this.props;

    return (
      <div hidden={isCartHidden}>
        <h1>Cart</h1>
        <div id="cartPageContainer">
          <div id={style.itemsInCart}>
            {this.state.itemsInCart.map((item) => (
              <div id={item.itemNameCamelCase} className={style.itemInCart}>
                <img alt="" src={item.itemImage} />
                <div className={style.itemInfo}>
                  <p>{item.gender}</p>
                  <p>{item.itemName}</p>
                  <p>Color: {item.color}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p>{"$" + item.unitPrice}</p>
                <input
                  value={item.quantity}
                  type="number"
                  min={1}
                  step={1}
                  onChange={(e) => {
                    this.updatePrices(e, item.itemNameCamelCase);
                  }}
                />
                <p>
                  {/* Set total item price here w/ this.state.totalItemPrices[itemNameCamelCase], which is updated in updatetotalItemPrices method */}
                  {/* {"$" +
                        roundToHundredth(
                          this.state.quantities[`${item.itemNameCamelCase}`] *
                            item.unitPrice
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })} */}
                  {}
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
            <p>Cart Subtotal: {}</p>
            <p>Shipping & Handling: -</p>
            <p>Discount: {}</p>
            <p>Cart Total: {}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;
