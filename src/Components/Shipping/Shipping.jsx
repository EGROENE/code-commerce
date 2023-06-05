import React from "react";
import style from "./Shipping.module.css";
import { alertShippingFormErrors, roundToHundredth } from "../../methods";

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        title: "",
        name: "",
        streetAddress: "",
        postalCode: "",
        city: "",
        phoneNumber: "",
      },
      details: {
        title: "",
        name: "",
        streetAddress: "",
        postalCode: "",
        city: "",
        stateOrTerritory: "",
        phoneNumber: "",
      },
      shippingAndHandling: 50,
      /* progressBarStatus: {
        cart: true,
        shipping: false,
        payment: false,
        confirmation: false,
      }, */
    };
  }

  // Method to set state values of dropdown fields (initially, at least, 'title' & 'state/territory'):
  setStateValuesOfDropdownFields = (e) => {
    let value = e.target.value;
    let field = e.target.id;
    this.setState((prevState) => ({
      details: {
        ...prevState.details,
        [field]: value,
      },
    }));
  };

  // Method to validate title, name, city:
  validateNameCity = (e, field) => {
    let value = e.target.value.trim();
    if (/^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value)) {
      console.log("valid ");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          [field]: "",
        },
        details: {
          ...prevState.details,
          [field]: value,
        },
      }));
    } else {
      console.log("invalid");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          [field]: "Enter only alphabetic characters",
        },
        details: {
          ...prevState.details,
          [field]: "",
        },
      }));
    }
  };

  // Method to validate street address:
  validateStreetAddress = (e) => {
    let value = e.target.value.trim();
    if (/[^A-Za-z0-9# -]+/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          streetAddress:
            "Enter only digits, English letters, '#', '/', or '-'.",
        },
        details: {
          ...prevState.details,
          streetAddress: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          streetAddress: "",
        },
        details: {
          ...prevState.details,
          streetAddress: value,
        },
      }));
    }
  };

  // Method to validate ZIP code:
  validatePostalCode = (e) => {
    let value = e.target.value.trim();
    let field = e.target.id;
    if (/^[0-9]{5}$/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCode: "",
        },
        details: {
          ...prevState.details,
          [field]: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCode: "5-digit US postal code",
        },
        details: {
          ...prevState.details,
          [field]: "",
        },
      }));
    }
  };

  // Method to validate phone number:
  validatePhoneNumber = (e) => {
    let value = e.target.value.trim();
    if (/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phoneNumber: "",
        },
        details: {
          ...prevState.details,
          phoneNumber: value.replace(/[^\d]/g, ""),
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phoneNumber:
            "Enter 10-digit number. You may use parentheses, hyphens, spaces, or periods to format it, or just type in full number.",
        },
        details: {
          ...prevState.details,
          phoneNumber: "",
        },
      }));
    }
  };

  // Method to update shipping & handling state value:
  handleDeliveryOptionSelection = (e) => {
    if (e.target.id === "expeditedDelivery") {
      this.setState((prevState) => ({
        ...prevState,
        shippingAndHandling: 50,
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        shippingAndHandling: 10,
      }));
    }
  };

  render() {
    const {
      isShippingHidden,
      toPreviousPage,
      toNextPage,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
    } = this.props;

    // Calculate totals based on current state values of unit prices & quantity:
    let cartSubtotal = itemsInCart.map(
      (item) => item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));

    let discount = roundToHundredth(cartSubtotal * discountRate);

    let cartTotal = cartSubtotal - discount + this.state.shippingAndHandling;

    const deliveryOptions = [
      {
        id: "expeditedDelivery",
        deliveryPrice: 50,
        label: "Expedited (within 3 hours): $50",
      },
      {
        id: "standardDelivery",
        deliveryPrice: 10,
        label: "Expedited (within 3 days): $10",
      },
    ];

    const summaryTotals = [
      { label: "Cart Subtotal:", value: cartSubtotal },
      { label: "Discount:", value: discount },
      { label: "Shipping & Handling:", value: this.state.shippingAndHandling },
      { label: "Cart Total:", value: cartTotal },
    ];

    let areNoErrors = Object.values(this.state.errors).every(
      (element) => element === ""
    );

    /* const progressBarInfo = [
      { id: "cart", class: "fas fa-shopping-cart" },
      { id: "shipping", class: "fas fa-shipping-fast" },
      { id: "payment", class: "fas fa-money-check-alt" },
      { id: "confirmation", class: "fas fa-check" },
    ]; */

    return (
      <div hidden={isShippingHidden}>
        <div className="progressBar">
          <i
            /*
          IS THERE A WAY TO POPULATE THIS WITH MAP, USING progressBarInfo array & this.state.progressBarStatus values?
            className={
              this.state.progressBarStatus.cart
                ? "fas fa-shopping-cart completed"
                : "fas fa-shopping-cart"
            } */
            className="fas fa-shopping-cart completed"
          ></i>
          <div className="progressBarConnector completed"></div>
          <i className="fas fa-shipping-fast"></i>
          <div className="progressBarConnector"></div>
          <i className="fas fa-money-check-alt"></i>
          <div className="progressBarConnector"></div>
          <i className="fas fa-check"></i>
        </div>
        <header className="pageHeader">Shipping</header>
        <div id={style.shippingPageMainItems}>
          <div>
            <form
              id="shippingForm"
              className={style.shippingForm}
              onSubmit={(e) => {
                toNextPage(e, "isShippingHidden", "isPaymentHidden");
              }}
            >
              <div id={style.titleName}>
                <label htmlFor="">
                  <header>Title: </header>
                  <select
                    id="title"
                    onChange={this.setStateValuesOfDropdownFields}
                  >
                    <option disabled selected>
                      -- select --
                    </option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Lord">Lord</option>
                    <option value="Lady">Lady</option>
                  </select>
                </label>
                <label>
                  <div>
                    <header>Name: </header>
                    <input
                      id="name"
                      type="text"
                      onBlur={(e) => {
                        this.validateNameCity(e, "name");
                      }}
                      placeholder="Enter recipient name"
                      required
                    />
                  </div>
                  {this.state.errors.name !== "" && (
                    <p>{this.state.errors.name}</p>
                  )}
                </label>
              </div>
              <label>
                <header>Street address: </header>
                <input
                  id="streetAddress"
                  type="text"
                  required
                  placeholder="Delivery address"
                  onBlur={this.validateStreetAddress}
                />
                {this.state.errors.streetAddress !== "" && (
                  <p>{this.state.errors.streetAddress}</p>
                )}
              </label>
              <div id={style.moreAddressDetails}>
                <label htmlFor="">
                  <header>ZIP Code</header>
                  <input
                    id="postalCode"
                    placeholder="5-digit ZIP code"
                    type="text"
                    onBlur={this.validatePostalCode}
                    required
                  />
                  {this.state.errors.postalCode !== "" && (
                    <p>{this.state.errors.postalCode}</p>
                  )}
                </label>
                <label>
                  <header>City: </header>
                  <input
                    id="city"
                    placeholder="Enter city"
                    type="text"
                    onBlur={(e) => {
                      this.validateNameCity(e, "city");
                    }}
                    required
                  />
                  {this.state.errors.city !== "" && (
                    <p>{this.state.errors.city}</p>
                  )}
                </label>
                <label>
                  <header>State: </header>
                  <select
                    id="stateOrTerritory"
                    onChange={this.setStateValuesOfDropdownFields}
                    required
                  >
                    <option disabled selected>
                      -- territory or state --
                    </option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AS">American Samoa</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="AA">Armed Forces Americas</option>
                    <option value="AP">Armed Forces Pacific</option>
                    <option value="AE">Armed Forces Others</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="GU">Guam</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UM">
                      United States Minor Outlying Islands
                    </option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="VI">Virgin Islands</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                </label>
              </div>
              <label id={style.phoneField}>
                <header>Phone: </header>
                <input
                  id="phoneNumber"
                  placeholder="Enter US phone number"
                  type="text"
                  onBlur={this.validatePhoneNumber}
                />
                {this.state.errors.phoneNumber !== "" && (
                  <p>{this.state.errors.phoneNumber}</p>
                )}
              </label>
            </form>
            <div id={style.deliveryOptions}>
              <header>
                Delivery Options <a href="#">Shipping Details</a>
              </header>
              {deliveryOptions.map((item) => (
                <label>
                  <input
                    type="radio"
                    id={item.id}
                    name="deliveryOption"
                    checked={
                      this.state.shippingAndHandling === item.deliveryPrice
                    }
                    onChange={this.handleDeliveryOptionSelection}
                  />
                  <p>{item.label}</p>
                </label>
              ))}
            </div>
          </div>
          <div id={style.cartSummary}>
            <div id={style.cartSummaryHeaders}>
              <header>Order Summary</header>
              {numberOfItemsInCart === 1 ? (
                <p>{numberOfItemsInCart} item in cart</p>
              ) : (
                <p>{numberOfItemsInCart} items in cart</p>
              )}
            </div>
            <div id={style.cartSummaryTotals}>
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
              <div id={style.shippingBackNextBtnContainer}>
                <button
                  title="Back to Cart"
                  onClick={(e) => {
                    toPreviousPage(e, "isCartHidden", "isShippingHidden");
                  }}
                >
                  Back to Cart
                </button>
                <button
                  form="shippingForm"
                  type={!areNoErrors ? "button" : "submit"}
                  title="To Payment"
                  onClick={!areNoErrors ? alertShippingFormErrors : undefined}
                >
                  To Payment
                </button>
              </div>
            </div>
            <div>
              {itemsInCart.map(
                (item) =>
                  item.quantity > 0 && (
                    <div className={style.itemInCartSummary}>
                      <img src={item.itemImage} alt="Item" />
                      <div className={style.itemDetailsShippingPage}>
                        <p>{item.itemName}</p>
                        <p>Category: {item.category}</p>
                        <p>Language: {item.language}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>
                          <span className={style.itemInfoHeader}>
                            Item Total:
                          </span>
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
          </div>
        </div>
      </div>
    );
  }
}

export default Shipping;
