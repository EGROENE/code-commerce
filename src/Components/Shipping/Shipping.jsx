import React from "react";
import style from "./Shipping.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";
import Payment from "../Payment/Payment";
import ProgressBar from "../ProgressBar/ProgressBar";

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        name: "",
        streetAddress: "",
        postalCode: "",
        city: "",
        phoneNumber: "",
      },
      details: {
        name: "",
        streetAddress: "",
        postalCode: "",
        city: "",
        stateOrTerritory: "",
        phoneNumber: "",
        phoneNumberMask: "",
      },
      shippingAndHandling: 50,
      deliveryTime: "3 seconds",
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
    console.log(!value.replace(/\s/g, ""));
    if (
      /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value) &&
      value.replace(/\s/g, "").length
    ) {
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
          [field]: "Enter alphabetical characters & any spaces between names",
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
    console.log(value);
    if (/[A-Z0-9#/ '-]+/i.test(value)) {
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
    } else {
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
    }
  };

  // Method to validate ZIP code:
  validatePostalCode = (e) => {
    let value = e.target.value;
    if (/[0-9]$/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCode: "",
        },
        details: {
          ...prevState.details,
          postalCode: value,
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
          postalCode: "",
        },
      }));
    }
  };

  formatPhoneNumber(phoneNumberString) {
    let cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return null;
  }

  // Method to validate phone number:
  validatePhoneNumber = (e) => {
    let value = e.target.value.trim();
    let phoneNumberMask = this.formatPhoneNumber(value);
    if (/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phoneNumber: "",
        },
        details: {
          ...prevState.details,
          phoneNumber: value.replace(/[^\d]/g, ""),
          phoneNumberMask: phoneNumberMask,
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phoneNumber: "Enter 10-digit, US number",
        },
        details: {
          ...prevState.details,
          phoneNumber: "",
          phoneNumberMask: phoneNumberMask,
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
        deliveryTime: "3 seconds",
      }));
    } else {
      this.setState((prevState) => ({
        ...prevState,
        shippingAndHandling: 10,
        deliveryTime: "3 days",
      }));
    }
  };

  render() {
    const {
      accountEmailAddress,
      isShippingHidden,
      isPaymentHidden,
      toPreviousPage,
      toNextPage,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      completedPages,
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
        label: "Expedited (within 3 seconds): $50",
      },
      {
        id: "standardDelivery",
        deliveryPrice: 10,
        label: "Standard (within 3 days): $10",
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

    return (
      <div id="shippingAndPayment">
        <div
          className={!isShippingHidden ? "checkoutPageContainer" : undefined}
          hidden={isShippingHidden}
        >
          <ProgressBar
            isShippingCompleted={completedPages.shipping}
            completedPages={completedPages}
          />
          <header className="pageHeader">Shipping</header>
          <div className="checkoutPageMainItems">
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
                        inputMode="text"
                        minLength="1"
                      />
                    </div>
                    {this.state.errors.name !== "" && (
                      <p>{this.state.errors.name}</p>
                    )}
                  </label>
                </div>
                <label>
                  <header>Street Address: </header>
                  <input
                    id="streetAddress"
                    type="text"
                    required
                    placeholder="Delivery address"
                    onBlur={this.validateStreetAddress}
                    inputMode="text"
                    minLength="1"
                  />
                  {this.state.errors.streetAddress !== "" && (
                    <p>{this.state.errors.streetAddress}</p>
                  )}
                </label>
                <div id={style.moreAddressDetails}>
                  <label htmlFor="">
                    <header>ZIP Code: </header>
                    <input
                      id="postalCode"
                      placeholder="5-digit ZIP code"
                      type="text"
                      onBlur={this.validatePostalCode}
                      required
                      inputMode="numeric"
                      minLength="5"
                      maxLength="5"
                    />
                    {this.state.errors.postalCode !== "" && (
                      <p>{this.state.errors.postalCode}</p>
                    )}
                  </label>
                  <label>
                    <header>City: </header>
                    <input
                      minLength="1"
                      id="city"
                      placeholder="Enter city"
                      type="text"
                      onBlur={(e) => {
                        this.validateNameCity(e, "city");
                      }}
                      required
                      inputMode="text"
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
                    onChange={this.validatePhoneNumber}
                    inputMode="numeric"
                    minLength="14"
                    maxLength="14"
                    value={
                      this.state.details.phoneNumberMask
                        ? this.state.details.phoneNumberMask
                        : undefined
                    }
                  />
                  {this.state.errors.phoneNumber !== "" && (
                    <p>{this.state.errors.phoneNumber}</p>
                  )}
                </label>
              </form>
              <div id={style.deliveryOptions}>
                <header>
                  Delivery Options: <a href="#">Shipping Details</a>
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
              <div className="checkoutBackNextBtnContainer">
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
                  onClick={!areNoErrors ? alertFormErrors : undefined}
                >
                  To Payment
                </button>
              </div>
            </div>
            <div className="cartSummary">
              <div className="cartSummaryHeaders">
                <header>Order Summary:</header>
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
              <div className="cartSummaryItem">
                {summaryTotals.map((item) => (
                  <p>
                    {item.label}
                    <span>
                      {" $" +
                        item.value.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Payment
          accountEmailAddress={accountEmailAddress}
          itemsInCart={itemsInCart}
          isPaymentHidden={isPaymentHidden}
          numberOfItemsInCart={numberOfItemsInCart}
          discountRate={discountRate}
          toNextPage={toNextPage}
          toPreviousPage={toPreviousPage}
          completedPages={completedPages}
          isShippingCompleted={!completedPages.shipping}
          shipmentDetails={this.state.details}
          shippingAndHandling={this.state.shippingAndHandling}
          deliveryTime={this.state.deliveryTime}
        />
      </div>
    );
  }
}

export default Shipping;
