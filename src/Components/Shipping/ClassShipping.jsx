import React from "react";
import style from "./Shipping.module.css";
import { usStateOptions } from "../../constants";

// Child components:
import ClassDropdownOption from "../DropdownOption/ClassDropdownOption";
import ClassOrderSummary from "../OrderSummary/ClassOrderSummary";
import ClassErrorMessage from "../ErrorMessage/ClassErrorMessage";
import ClassProgressBar from "../ProgressBar/ClassProgressBar";

import { roundToHundredth } from "../../methods";
import {
  nameOrCityIsValid,
  phoneNumberIsValid,
  postalCodeIsValid,
  streetAddressIsValid,
} from "../../validations";

class ClassShipping extends React.Component {
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
      hasFailedSubmission,
      handleRejection,
      toPreviousPage,
      toNextPage,
      itemsInCart,
      numberOfItemsInCart,
      discountRate,
      shippingDetails,
      setOrderDetails,
      shippingAndHandling,
      setShippingAndHandling,
      setDeliveryTime,
      arePagesComplete,
    } = this.props;

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
      { value: "Mr." },
      { value: "Mrs." },
      { value: "Ms." },
      { value: "Dr." },
      { value: "Lord" },
      { value: "Lady" },
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

    const validators = {
      nameIsValid: nameOrCityIsValid(shippingDetails.name),
      streetAddressIsValid: streetAddressIsValid(shippingDetails.streetAddress),
      cityIsValid: nameOrCityIsValid(shippingDetails.city),
      postalCodeIsValid: postalCodeIsValid(shippingDetails.postalCode),
      phoneNumberIsValid: phoneNumberIsValid(shippingDetails.phoneNumber),
    };

    const areNoErrors =
      Object.values(validators).every((validator) => validator === true) &&
      shippingDetails.stateOrTerritory !== "";

    return (
      <div id="shippingAndPayment">
        <div className="checkoutPageContainer">
          <ClassProgressBar arePagesComplete={arePagesComplete} />
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
                      <option value="">--select title--</option>
                      {titles.map((option) => (
                        <ClassDropdownOption
                          key={option.value}
                          value={option.value}
                        />
                      ))}
                    </select>
                  </label>
                  <label id={style.nameField}>
                    <div>
                      <header>Name: </header>
                      <input
                        className={
                          hasFailedSubmission &&
                          (!validators.nameIsValid ||
                            shippingDetails.name === "")
                            ? "inputWhenError"
                            : undefined
                        }
                        value={shippingDetails.name}
                        id="name"
                        type="text"
                        onChange={(e) => {
                          setOrderDetails("shipping", "name", e.target.value);
                        }}
                        placeholder="Recipient name"
                        required
                        inputMode="text"
                        minLength="1"
                        autoComplete="on"
                      />
                    </div>
                    {hasFailedSubmission &&
                      shippingDetails.name !== "" &&
                      !validators.nameIsValid && (
                        <ClassErrorMessage
                          id={style.nameErrorMessage}
                          message="Enter alphabetical characters & any spaces or hyphens between words"
                        />
                      )}
                  </label>
                </div>
                <label>
                  <header>Street Address: </header>
                  <input
                    className={
                      hasFailedSubmission &&
                      (!validators.streetAddressIsValid ||
                        shippingDetails.streetAddress === "")
                        ? "inputWhenError"
                        : undefined
                    }
                    value={shippingDetails.streetAddress}
                    id="streetAddress"
                    type="text"
                    required
                    placeholder="Delivery address"
                    onChange={(e) =>
                      setOrderDetails(
                        "shipping",
                        "streetAddress",
                        e.target.value
                      )
                    }
                    inputMode="text"
                    minLength="1"
                    autoComplete="street-address"
                  />
                  {hasFailedSubmission &&
                    shippingDetails.streetAddress !== "" &&
                    !validators.streetAddressIsValid && (
                      <ClassErrorMessage message="Please enter a valid address" />
                    )}
                </label>
                <div id={style.moreAddressDetails}>
                  <label>
                    <header>ZIP Code: </header>
                    <input
                      className={
                        hasFailedSubmission &&
                        (!validators.postalCodeIsValid ||
                          shippingDetails.postalCode === "")
                          ? "inputWhenError"
                          : undefined
                      }
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
                      }}
                      required
                      inputMode="numeric"
                      minLength="5"
                      maxLength="5"
                      autoComplete="postal-code"
                    />
                    {hasFailedSubmission &&
                      shippingDetails.postalCode !== "" &&
                      !validators.postalCodeIsValid && (
                        <ClassErrorMessage message="5-digit US postal code" />
                      )}
                  </label>
                  <label>
                    <header>City: </header>
                    <input
                      className={
                        hasFailedSubmission &&
                        (!validators.cityIsValid || shippingDetails.city === "")
                          ? "inputWhenError"
                          : undefined
                      }
                      value={shippingDetails.city}
                      minLength="1"
                      id="city"
                      placeholder="Enter city"
                      type="text"
                      onChange={(e) => {
                        setOrderDetails("shipping", "city", e.target.value);
                      }}
                      required
                      inputMode="text"
                      autoComplete="on"
                    />
                    {hasFailedSubmission &&
                      shippingDetails.city !== "" &&
                      !validators.cityIsValid && (
                        <ClassErrorMessage message="Enter a valid city" />
                      )}
                  </label>
                  <label>
                    <header>State/Territory: </header>
                    <select
                      className={
                        hasFailedSubmission &&
                        shippingDetails.stateOrTerritory === ""
                          ? "inputWhenError"
                          : undefined
                      }
                      id="stateOrTerritory"
                      onChange={(e) =>
                        setOrderDetails(
                          "shipping",
                          "stateOrTerritory",
                          e.target.value
                        )
                      }
                    >
                      <option value="">--state or territory--</option>
                      {usStateOptions.map((option) => (
                        <ClassDropdownOption
                          key={option.value}
                          isDisabled={option.isDisabled}
                          value={option.value}
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
                    className={
                      hasFailedSubmission &&
                      (!validators.phoneNumberIsValid ||
                        shippingDetails.phoneNumber === "")
                        ? "inputWhenError"
                        : undefined
                    }
                    id="phoneNumber"
                    placeholder="US phone number"
                    type="text"
                    onChange={(e) => {
                      setOrderDetails(
                        "shipping",
                        "phoneNumber",
                        e.target.value
                      );
                      setOrderDetails(
                        "shipping",
                        "phoneNumberMask",
                        this.formatPhoneNumber(e.target.value)
                      );
                    }}
                    inputMode="numeric"
                    minLength="14"
                    maxLength="14"
                    /* Value produces warning that the input is changing from controlled to uncontrolled. This is because it is set to the state value of another component. Disregard this warning, as app functions properly this way. */
                    value={shippingDetails.phoneNumberMask}
                    required
                    autoComplete="tel-national"
                  />
                  {hasFailedSubmission &&
                    shippingDetails.phoneNumber !== "" &&
                    !validators.phoneNumberIsValid && (
                      <ClassErrorMessage message="10-digit, US number" />
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
                  type={!areNoErrors ? "button" : "submit"}
                  title="To Payment"
                  onClick={!areNoErrors ? handleRejection : undefined}
                >
                  To Payment
                </button>
              </div>
            </div>
            <ClassOrderSummary
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

export default ClassShipping;
