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
                      <option
                        selected={shipmentDetails.title === "Mr."}
                        value="Mr."
                      >
                        Mr.
                      </option>
                      <option
                        selected={shipmentDetails.title === "Mrs."}
                        value="Mrs."
                      >
                        Mrs.
                      </option>
                      <option
                        selected={shipmentDetails.title === "Ms."}
                        value="Ms."
                      >
                        Ms.
                      </option>
                      <option
                        selected={shipmentDetails.title === "Dr."}
                        value="Dr."
                      >
                        Dr.
                      </option>
                      <option
                        selected={shipmentDetails.title === "Lord"}
                        value="Lord"
                      >
                        Lord
                      </option>
                      <option
                        selected={shipmentDetails.title === "Lady"}
                        value="Lady"
                      >
                        Lady
                      </option>
                    </select>
                  </label>
                  <label id={style.nameField}>
                    <div>
                      <header>Name: </header>
                      <input
                        value={shipmentDetails.name}
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
                    value={shipmentDetails.streetAddress}
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
                      value={shipmentDetails.postalCode}
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
                      value={shipmentDetails.city}
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
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AL"}
                        value="AL"
                      >
                        Alabama
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AK"}
                        value="AK"
                      >
                        Alaska
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AS"}
                        value="AS"
                      >
                        American Samoa
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AZ"}
                        value="AZ"
                      >
                        Arizona
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AR"}
                        value="AR"
                      >
                        Arkansas
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AA"}
                        value="AA"
                      >
                        Armed Forces Americas
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AP"}
                        value="AP"
                      >
                        Armed Forces Pacific
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "AE"}
                        value="AE"
                      >
                        Armed Forces Others
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "CA"}
                        value="CA"
                      >
                        California
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "CO"}
                        value="CO"
                      >
                        Colorado
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "CT"}
                        value="CT"
                      >
                        Connecticut
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "DE"}
                        value="DE"
                      >
                        Delaware
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "DC"}
                        value="DC"
                      >
                        District Of Columbia
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "FL"}
                        value="FL"
                      >
                        Florida
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "GA"}
                        value="GA"
                      >
                        Georgia
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "GU"}
                        value="GU"
                      >
                        Guam
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "HI"}
                        value="HI"
                      >
                        Hawaii
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "ID"}
                        value="ID"
                      >
                        Idaho
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "IL"}
                        value="IL"
                      >
                        Illinois
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "IN"}
                        value="IN"
                      >
                        Indiana
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "IA"}
                        value="IA"
                      >
                        Iowa
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "KS"}
                        value="KS"
                      >
                        Kansas
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "KY"}
                        value="KY"
                      >
                        Kentucky
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "LA"}
                        value="LA"
                      >
                        Louisiana
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "ME"}
                        value="ME"
                      >
                        Maine
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MD"}
                        value="MD"
                      >
                        Maryland
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MA"}
                        value="MA"
                      >
                        Massachusetts
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MI"}
                        value="MI"
                      >
                        Michigan
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MN"}
                        value="MN"
                      >
                        Minnesota
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MS"}
                        value="MS"
                      >
                        Mississippi
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MO"}
                        value="MO"
                      >
                        Missouri
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MT"}
                        value="MT"
                      >
                        Montana
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "MP"}
                        value="MP"
                      >
                        Northern Mariana Islands
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NE"}
                        value="NE"
                      >
                        Nebraska
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NV"}
                        value="NV"
                      >
                        Nevada
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NH"}
                        value="NH"
                      >
                        New Hampshire
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NJ"}
                        value="NJ"
                      >
                        New Jersey
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NM"}
                        value="NM"
                      >
                        New Mexico
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NY"}
                        value="NY"
                      >
                        New York
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "NC"}
                        value="NC"
                      >
                        North Carolina
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "ND"}
                        value="ND"
                      >
                        North Dakota
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "OH"}
                        value="OH"
                      >
                        Ohio
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "OK"}
                        value="OK"
                      >
                        Oklahoma
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "OR"}
                        value="OR"
                      >
                        Oregon
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "PA"}
                        value="PA"
                      >
                        Pennsylvania
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "PR"}
                        value="PR"
                      >
                        Puerto Rico
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "RI"}
                        value="RI"
                      >
                        Rhode Island
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "SC"}
                        value="SC"
                      >
                        South Carolina
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "SD"}
                        value="SD"
                      >
                        South Dakota
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "TN"}
                        value="TN"
                      >
                        Tennessee
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "TX"}
                        value="TX"
                      >
                        Texas
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "UM"}
                        value="UM"
                      >
                        United States Minor Outlying Islands
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "UT"}
                        value="UT"
                      >
                        Utah
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "VT"}
                        value="VT"
                      >
                        Vermont
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "VA"}
                        value="VA"
                      >
                        Virginia
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "VI"}
                        value="VI"
                      >
                        Virgin Islands
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "WA"}
                        value="WA"
                      >
                        Washington
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "WV"}
                        value="WV"
                      >
                        West Virginia
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "WI"}
                        value="WI"
                      >
                        Wisconsin
                      </option>
                      <option
                        selected={shipmentDetails.stateOrTerritory === "WY"}
                        value="WY"
                      >
                        Wyoming
                      </option>
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
