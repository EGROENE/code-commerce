import React from "react";
import style from "./Shipping.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";
import ProgressBar from "../ProgressBar/ProgressBar";

class Shipping extends React.Component {
  constructor() {
    super();
    this.state = {
      shippingErrors: {
        nameError: "",
        streetAddressError: "",
        postalCodeError: "",
        cityError: "",
        phoneNumberError: "",
      },
    };
  }

  formatPhoneNumber(phoneNumberString) {
    const cleaned = ("" + phoneNumberString).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return "(" + match[1] + ") " + match[2] + "-" + match[3];
    }
    return undefined;
  }

  render() {
    // Destructure props:
    const {
      toPreviousPage,
      toNextPage,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      shippingDetails,
      setOrderDetails,
      postalCodeIsValid,
      shippingAndHandling,
      setShippingAndHandling,
      setDeliveryTime,
      arePagesComplete,
      nameOrCityIsValid,
    } = this.props;

    const validateStreetAddress = (e) => {
      const value = e.target.value;
      setOrderDetails("shipping", "streetAddress", value);
      if (
        /[A-Z0-9#/ '-]+/i.test(value) &&
        value.replace(/\s/g, "").length &&
        value.replace(/'/g, "").length &&
        value.replace(/-/g, "").length
      ) {
        this.setState((prevState) => ({
          ...prevState,
          shippingErrors: {
            ...prevState.shippingErrors,
            streetAddressError: "",
          },
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          shippingErrors: {
            ...prevState.shippingErrors,
            streetAddressError: "Please enter a valid address",
          },
        }));
      }
    };

    const validatePhoneNumber = (e) => {
      const value = e.target.value.trim();
      const phoneNumberMask = this.formatPhoneNumber(value);

      setOrderDetails("shipping", "phoneNumber", value);
      setOrderDetails("shipping", "phoneNumberMask", phoneNumberMask);

      if (
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/i.test(value)
      ) {
        this.setState((prevState) => ({
          ...prevState,
          shippingErrors: {
            ...prevState.shippingErrors,
            phoneNumberError: "",
          },
        }));
      } else {
        this.setState((prevState) => ({
          ...prevState,
          shippingErrors: {
            ...prevState.shippingErrors,
            phoneNumberError: "Enter 10-digit, US number",
          },
        }));
      }
    };

    const handleDeliveryOptionSelection = (e) => {
      if (e.target.id === "expeditedDelivery") {
        setShippingAndHandling(50);
        setDeliveryTime("3 seconds");
      } else {
        setShippingAndHandling(10);
        setDeliveryTime("3 days");
      }
    };

    // Calculate totals based on current state values of unit prices & quantity:
    const cartSubtotal = roundToHundredth(
      itemsInCart
        .map((item) => item.unitPrice * item.quantity)
        .reduce((a, b) => a + b)
    );

    const discount = roundToHundredth(cartSubtotal * discountRate);

    const cartTotal = cartSubtotal - discount + shippingAndHandling;

    const titles = [
      { isDisabled: true, isSelected: true, value: "--select--" },
      { isSelected: shippingDetails.title === "Mr.", value: "Mr." },
      { isSelected: shippingDetails.title === "Mrs.", value: "Mrs." },
      { isSelected: shippingDetails.title === "Ms.", value: "Ms." },
      { isSelected: shippingDetails.title === "Dr.", value: "Dr." },
      { isSelected: shippingDetails.title === "Lord", value: "Lord" },
      { isSelected: shippingDetails.title === "Lady", value: "Lady" },
    ];

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

    const areNoErrors = Object.values(this.state.shippingErrors).every(
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
                      onChange={(e) =>
                        setOrderDetails("shipping", "title", e.target.value)
                      }
                    >
                      {titles.map((option) => (
                        <option
                          key={option.value}
                          disabled={option.isDisabled}
                          selected={option.isSelected}
                          value={option.value}
                        >
                          {option.value}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label id={style.nameField}>
                    <div>
                      <header>Name: </header>
                      <input
                        value={shippingDetails.name}
                        id="name"
                        type="text"
                        onChange={(e) => {
                          setOrderDetails("shipping", "name", e.target.value);
                          if (nameOrCityIsValid(e.target.value)) {
                            this.setState((prevState) => ({
                              ...prevState,
                              shippingErrors: {
                                ...prevState.shippingErrors,
                                nameError: "",
                              },
                            }));
                          } else {
                            this.setState((prevState) => ({
                              ...prevState,
                              shippingErrors: {
                                ...prevState.shippingErrors,
                                nameError:
                                  "Enter alphabetical characters & any spaces or hyphens between words",
                              },
                            }));
                          }
                        }}
                        placeholder="Recipient name"
                        required
                        inputMode="text"
                        minLength="1"
                        autoComplete="on"
                      />
                    </div>
                    {this.state.shippingErrors.nameError !== "" && (
                      <p id={style.nameErrorMessage}>
                        {this.state.shippingErrors.nameError}
                      </p>
                    )}
                  </label>
                </div>
                <label>
                  <header>Street Address: </header>
                  <input
                    value={shippingDetails.streetAddress}
                    id="streetAddress"
                    type="text"
                    required
                    placeholder="Delivery address"
                    onChange={validateStreetAddress}
                    inputMode="text"
                    minLength="1"
                    autoComplete="street-address"
                  />
                  {this.state.shippingErrors.streetAddressError !== "" && (
                    <p>{this.state.shippingErrors.streetAddressError}</p>
                  )}
                </label>
                <div id={style.moreAddressDetails}>
                  <label>
                    <header>ZIP Code: </header>
                    <input
                      value={shippingDetails.postalCode}
                      id="postalCode"
                      placeholder="5-digit ZIP code"
                      type="text"
                      onChange={(e) => {
                        setOrderDetails(
                          "shipping",
                          "postalCode",
                          e.target.value
                        );
                        if (postalCodeIsValid(e.target.value)) {
                          this.setState((prevState) => ({
                            ...prevState,
                            shippingErrors: {
                              ...prevState.loginErrors,
                              postalCodeError: "",
                            },
                          }));
                        } else {
                          this.setState((prevState) => ({
                            ...prevState,
                            shippingErrors: {
                              ...prevState.loginErrors,
                              postalCodeError: "5-digit US postal code",
                            },
                          }));
                        }
                      }}
                      required
                      inputMode="numeric"
                      minLength="5"
                      maxLength="5"
                      autoComplete="postal-code"
                    />
                    {this.state.shippingErrors.postalCodeError !== "" && (
                      <p>{this.state.shippingErrors.postalCodeError}</p>
                    )}
                  </label>
                  <label>
                    <header>City: </header>
                    <input
                      value={shippingDetails.city}
                      minLength="1"
                      id="city"
                      placeholder="Enter city"
                      type="text"
                      onChange={(e) => {
                        setOrderDetails("shipping", "city", e.target.value);
                        if (nameOrCityIsValid(e.target.value)) {
                          this.setState((prevState) => ({
                            ...prevState,
                            shippingErrors: {
                              ...prevState.shippingErrors,
                              cityError: "",
                            },
                          }));
                        } else {
                          this.setState((prevState) => ({
                            ...prevState,
                            shippingErrors: {
                              ...prevState.shippingErrors,
                              cityError:
                                "Enter alphabetical characters & any spaces between words",
                            },
                          }));
                        }
                      }}
                      required
                      inputMode="text"
                      autoComplete="on"
                    />
                    {this.state.shippingErrors.cityError !== "" && (
                      <p>{this.state.shippingErrors.cityError}</p>
                    )}
                  </label>
                  <label>
                    <header>State/Territory: </header>
                    <select
                      id="stateOrTerritory"
                      onChange={(e) =>
                        setOrderDetails(
                          "shipping",
                          "stateOrTerritory",
                          e.target.value
                        )
                      }
                    >
                      <option disabled selected>
                        -- state or territory --
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AL"}
                        value="AL"
                      >
                        Alabama
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AK"}
                        value="AK"
                      >
                        Alaska
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AS"}
                        value="AS"
                      >
                        American Samoa
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AZ"}
                        value="AZ"
                      >
                        Arizona
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AR"}
                        value="AR"
                      >
                        Arkansas
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AA"}
                        value="AA"
                      >
                        Armed Forces Americas
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AP"}
                        value="AP"
                      >
                        Armed Forces Pacific
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "AE"}
                        value="AE"
                      >
                        Armed Forces Others
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "CA"}
                        value="CA"
                      >
                        California
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "CO"}
                        value="CO"
                      >
                        Colorado
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "CT"}
                        value="CT"
                      >
                        Connecticut
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "DE"}
                        value="DE"
                      >
                        Delaware
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "DC"}
                        value="DC"
                      >
                        District Of Columbia
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "FL"}
                        value="FL"
                      >
                        Florida
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "GA"}
                        value="GA"
                      >
                        Georgia
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "GU"}
                        value="GU"
                      >
                        Guam
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "HI"}
                        value="HI"
                      >
                        Hawaii
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "ID"}
                        value="ID"
                      >
                        Idaho
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "IL"}
                        value="IL"
                      >
                        Illinois
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "IN"}
                        value="IN"
                      >
                        Indiana
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "IA"}
                        value="IA"
                      >
                        Iowa
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "KS"}
                        value="KS"
                      >
                        Kansas
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "KY"}
                        value="KY"
                      >
                        Kentucky
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "LA"}
                        value="LA"
                      >
                        Louisiana
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "ME"}
                        value="ME"
                      >
                        Maine
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MD"}
                        value="MD"
                      >
                        Maryland
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MA"}
                        value="MA"
                      >
                        Massachusetts
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MI"}
                        value="MI"
                      >
                        Michigan
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MN"}
                        value="MN"
                      >
                        Minnesota
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MS"}
                        value="MS"
                      >
                        Mississippi
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MO"}
                        value="MO"
                      >
                        Missouri
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MT"}
                        value="MT"
                      >
                        Montana
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "MP"}
                        value="MP"
                      >
                        Northern Mariana Islands
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NE"}
                        value="NE"
                      >
                        Nebraska
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NV"}
                        value="NV"
                      >
                        Nevada
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NH"}
                        value="NH"
                      >
                        New Hampshire
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NJ"}
                        value="NJ"
                      >
                        New Jersey
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NM"}
                        value="NM"
                      >
                        New Mexico
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NY"}
                        value="NY"
                      >
                        New York
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "NC"}
                        value="NC"
                      >
                        North Carolina
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "ND"}
                        value="ND"
                      >
                        North Dakota
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "OH"}
                        value="OH"
                      >
                        Ohio
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "OK"}
                        value="OK"
                      >
                        Oklahoma
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "OR"}
                        value="OR"
                      >
                        Oregon
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "PA"}
                        value="PA"
                      >
                        Pennsylvania
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "PR"}
                        value="PR"
                      >
                        Puerto Rico
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "RI"}
                        value="RI"
                      >
                        Rhode Island
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "SC"}
                        value="SC"
                      >
                        South Carolina
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "SD"}
                        value="SD"
                      >
                        South Dakota
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "TN"}
                        value="TN"
                      >
                        Tennessee
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "TX"}
                        value="TX"
                      >
                        Texas
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "UM"}
                        value="UM"
                      >
                        United States Minor Outlying Islands
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "UT"}
                        value="UT"
                      >
                        Utah
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "VT"}
                        value="VT"
                      >
                        Vermont
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "VA"}
                        value="VA"
                      >
                        Virginia
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "VI"}
                        value="VI"
                      >
                        Virgin Islands
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "WA"}
                        value="WA"
                      >
                        Washington
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "WV"}
                        value="WV"
                      >
                        West Virginia
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "WI"}
                        value="WI"
                      >
                        Wisconsin
                      </option>
                      <option
                        selected={shippingDetails.stateOrTerritory === "WY"}
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
                    value={shippingDetails.phoneNumberMask}
                    required
                    autoComplete="tel-national"
                  />
                  {this.state.shippingErrors.phoneNumberError !== "" && (
                    <p>{this.state.shippingErrors.phoneNumberError}</p>
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
                    !areNoErrors || shippingDetails.stateOrTerritory === ""
                      ? "button"
                      : "submit"
                  }
                  title="To Payment"
                  onClick={
                    !areNoErrors || shippingDetails.stateOrTerritory === ""
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
