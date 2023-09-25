import React from "react";
import style from "./Shipping.module.css";
import { alertFormErrors, roundToHundredth } from "../../methods";
import ProgressBar from "../ProgressBar/ProgressBar";
import { usStateOptions } from "../../constants";
import DropdownOption from "../DropdownOption";
import OrderSummary from "../OrderSummary";

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
                      <option disabled={true} selected={true}>
                        --select title--
                      </option>
                      {titles.map((option) => (
                        <DropdownOption
                          key={option.value}
                          isSelected={option.value === shippingDetails.title}
                          value={option.value}
                        />
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
                      <option disabled={true} selected={true}>
                        --state or territory--
                      </option>
                      {usStateOptions.map((option) => (
                        <DropdownOption
                          key={option.value}
                          isDisabled={option.isDisabled}
                          value={option.value}
                          isSelected={
                            option.value === shippingDetails.stateOrTerritory
                          }
                          fullName={option.fullName}
                          valueAndTextAreDifferent={true}
                        />
                      ))}
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
            <OrderSummary
              numberOfItemsInCart={numberOfItemsInCart}
              itemsInCart={itemsInCart}
              summaryTotals={summaryTotals}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Shipping;
