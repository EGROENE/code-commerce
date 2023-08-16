import React from "react";
import style from "./Shipping.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";
import ProgressBar from "../ProgressBar/ProgressBar";

class Shipping extends React.Component {
  render() {
    // Destructure props:
    const {
      toPreviousPage,
      toNextPage,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      validatePostalCode,
      validateNameCity,
      setStateValuesOfDropdownFields,
      validateStreetAddress,
      validatePhoneNumber,
      handleDeliveryOptionSelection,
      shippingErrors,
      shippingAndHandling,
      shipmentDetails,
      arePagesComplete,
    } = this.props;

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

    let areNoErrors = Object.values(shippingErrors).every(
      (element) => element === ""
    );

    return (
      <div id="shippingAndPayment">
        <div className="checkoutPageContainer">
          <ProgressBar arePagesComplete={arePagesComplete} />
          <header className="pageHeader">Shipping</header>
          <div className="checkoutPageMainItems">
            <div>
              <form
                id="shippingForm"
                className={style.shippingForm}
                onSubmit={(e) => {
                  toNextPage(e, "Shipping");
                }}
              >
                <div id={style.titleName}>
                  <label>
                    <header>Title: </header>
                    <select
                      id="title"
                      onChange={setStateValuesOfDropdownFields}
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
                          validateNameCity(e, "name");
                        }}
                        placeholder="Recipient name"
                        required
                        inputMode="text"
                        minLength="1"
                        autoComplete="on"
                      />
                    </div>
                    {shippingErrors.name !== "" && (
                      <p id={style.nameErrorMessage}>{shippingErrors.name}</p>
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
                    onChange={validateStreetAddress}
                    inputMode="text"
                    minLength="1"
                    autoComplete="street-address"
                  />
                  {shippingErrors.streetAddress !== "" && (
                    <p>{shippingErrors.streetAddress}</p>
                  )}
                </label>
                <div id={style.moreAddressDetails}>
                  <label>
                    <header>ZIP Code: </header>
                    <input
                      id="postalCode"
                      placeholder="5-digit ZIP code"
                      type="text"
                      onChange={(e) => {
                        validatePostalCode(e, "shipping");
                      }}
                      required
                      inputMode="numeric"
                      minLength="5"
                      maxLength="5"
                      autoComplete="postal-code"
                    />
                    {shippingErrors.postalCode !== "" && (
                      <p>{shippingErrors.postalCode}</p>
                    )}
                  </label>
                  <label>
                    <header>City: </header>
                    <input
                      minLength="1"
                      id="city"
                      placeholder="Enter city"
                      type="text"
                      onChange={(e) => {
                        validateNameCity(e, "city");
                      }}
                      required
                      inputMode="text"
                      autoComplete="on"
                    />
                    {shippingErrors.city !== "" && <p>{shippingErrors.city}</p>}
                  </label>
                  <label>
                    <header>State/Territory: </header>
                    <select
                      id="stateOrTerritory"
                      onChange={setStateValuesOfDropdownFields}
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
                    onChange={validatePhoneNumber}
                    inputMode="numeric"
                    minLength="14"
                    maxLength="14"
                    value={shipmentDetails.phoneNumberMask}
                    required
                    autoComplete="tel-national"
                  />
                  {shippingErrors.phoneNumber !== "" && (
                    <p>{shippingErrors.phoneNumber}</p>
                  )}
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
                      onChange={handleDeliveryOptionSelection}
                    />
                    <p>{item.label}</p>
                  </label>
                ))}
              </div>
              <div className="checkoutBackNextBtnContainer">
                <button
                  title="Back to Cart"
                  onClick={(e) => {
                    toPreviousPage(e, "Shipping", "Cart");
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
      </div>
    );
  }
}

export default Shipping;
