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
      shipmentDetails: {
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
      shipmentDetails: {
        ...prevState.shipmentDetails,
        [field]: value,
      },
    }));
  };

  // Method to validate title, name, city:
  validateNameCity = (e, field) => {
    let value = e.target.value.trim();
    if (
      /^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -.]*$/i.test(value) &&
      value.replace(/\s/g, "").length
    ) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          [field]: "",
        },
        shipmentDetails: {
          ...prevState.shipmentDetails,
          [field]: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          [field]: "Enter alphabetical characters & any spaces between words",
        },
        shipmentDetails: {
          ...prevState.shipmentDetails,
          [field]: "",
        },
      }));
    }
  };

  // Method to validate street address:
  validateStreetAddress = (e) => {
    let value = e.target.value.trim();
    if (/[A-Z0-9#/ '-]+/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          streetAddress: "",
        },
        shipmentDetails: {
          ...prevState.shipmentDetails,
          streetAddress: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          streetAddress: "Please enter a valid address",
        },
        shipmentDetails: {
          ...prevState.shipmentDetails,
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
        shipmentDetails: {
          ...prevState.shipmentDetails,
          postalCode: value,
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCode: "5-digit US postal code",
        },
        shipmentDetails: {
          ...prevState.shipmentDetails,
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
    return undefined;
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
        shipmentDetails: {
          ...prevState.shipmentDetails,
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
        shipmentDetails: {
          ...prevState.shipmentDetails,
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
    // Destructure props:
    const {
      accountEmailAddress,
      isShippingHidden,
      isPaymentHidden,
      isConfirmationHidden,
      toPreviousPage,
      toNextPage,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      completedPages,
    } = this.props;

    // Destructure state:
    const { shippingAndHandling, errors, shipmentDetails, deliveryTime } =
      this.state;

    // Calculate totals based on current state values of unit prices & quantity:
    let cartSubtotal = itemsInCart.map(
      (item) => item.unitPrice * item.quantity
    );
    cartSubtotal = roundToHundredth(cartSubtotal.reduce((a, b) => a + b));

    let discount = roundToHundredth(cartSubtotal * discountRate);

    let cartTotal = cartSubtotal - discount + shippingAndHandling;

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
      { label: "Shipping & Handling:", value: shippingAndHandling },
      { label: "Cart Total:", value: cartTotal },
    ];

    let areNoErrors = Object.values(errors).every((element) => element === "");

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
                  <label>
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
                  <label id={style.nameField}>
                    <div>
                      <header>Name: </header>
                      <input
                        id="name"
                        type="text"
                        onChange={(e) => {
                          this.validateNameCity(e, "name");
                        }}
                        placeholder="Recipient name"
                        required
                        inputMode="text"
                        minLength="1"
                        autoComplete="on"
                      />
                    </div>
                    {errors.name !== "" && (
                      <p id={style.nameErrorMessage}>{errors.name}</p>
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
                    onChange={this.validateStreetAddress}
                    inputMode="text"
                    minLength="1"
                    autoComplete="street-address"
                  />
                  {this.state.errors.streetAddress !== "" && (
                    <p>{errors.streetAddress}</p>
                  )}
                </label>
                <div id={style.moreAddressDetails}>
                  <label>
                    <header>ZIP Code: </header>
                    <input
                      id="postalCode"
                      placeholder="5-digit ZIP code"
                      type="text"
                      onChange={this.validatePostalCode}
                      required
                      inputMode="numeric"
                      minLength="5"
                      maxLength="5"
                      autoComplete="postal-code"
                    />
                    {errors.postalCode !== "" && <p>{errors.postalCode}</p>}
                  </label>
                  <label>
                    <header>City: </header>
                    <input
                      minLength="1"
                      id="city"
                      placeholder="Enter city"
                      type="text"
                      onChange={(e) => {
                        this.validateNameCity(e, "city");
                      }}
                      required
                      inputMode="text"
                      autoComplete="on"
                    />
                    {errors.city !== "" && <p>{errors.city}</p>}
                  </label>
                  <label>
                    <header>State/Territory: </header>
                    <select
                      id="stateOrTerritory"
                      onChange={this.setStateValuesOfDropdownFields}
                    >
                      <option disabled selected>
                        -- state or territory --
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
                    placeholder="US phone number"
                    type="text"
                    onChange={this.validatePhoneNumber}
                    inputMode="numeric"
                    minLength="14"
                    maxLength="14"
                    value={shipmentDetails.phoneNumberMask}
                    required
                    autoComplete="tel-national"
                  />
                  {errors.phoneNumber !== "" && <p>{errors.phoneNumber}</p>}
                </label>
              </form>
              <div id={style.deliveryOptions}>
                <header>
                  Delivery Options:{" "}
                  <span title="Read about the shipping process">
                    Shipping Details
                  </span>
                </header>
                {deliveryOptions.map((item) => (
                  <label key={item.id}>
                    <input
                      type="radio"
                      id={item.id}
                      name="deliveryOption"
                      checked={shippingAndHandling === item.deliveryPrice}
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
                  type={
                    !areNoErrors || shipmentDetails.stateOrTerritory === ""
                      ? "button"
                      : "submit"
                  }
                  title="To Payment"
                  onClick={
                    !areNoErrors || shipmentDetails.stateOrTerritory === ""
                      ? alertFormErrors
                      : undefined
                  }
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
              <div
                id={
                  numberOfItemsInCart > 2
                    ? style.itemsInCartSummarySeveral
                    : undefined
                }
              >
                <div id={style.itemsContainer}>
                  {itemsInCart.map(
                    (item) =>
                      item.quantity > 0 && (
                        <div
                          key={item.itemNameCamelCase}
                          className="itemInCartSummary"
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
              </div>
              <div className="cartSummaryItem">
                {summaryTotals.map((item) => (
                  <p key={item.label}>
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
          isConfirmationHidden={isConfirmationHidden}
          numberOfItemsInCart={numberOfItemsInCart}
          discountRate={discountRate}
          toNextPage={toNextPage}
          toPreviousPage={toPreviousPage}
          completedPages={completedPages}
          isShippingCompleted={!completedPages.shipping}
          shipmentDetails={shipmentDetails}
          shippingAndHandling={shippingAndHandling}
          deliveryTime={deliveryTime}
        />
      </div>
    );
  }
}

export default Shipping;
