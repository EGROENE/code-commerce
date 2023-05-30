import React from "react";
import style from "./Shipping.module.css";

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
    };
  }

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
      }));
    } else {
      console.log("invalid");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          [field]: "Enter only alphabetic characters",
        },
      }));
    }
  };

  // Method to validate street address:
  validateStreetAddress = (e) => {
    let value = e.target.value.trim().trim();
    if (/[^A-Za-z0-9# -]+/i.test(value)) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          streetAddress:
            "Street address may only contain digits & English letters",
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          streetAddress: "",
        },
      }));
    }
  };

  // Method to validate ZIP code:
  validatePostalCode = (e) => {
    let value = e.target.value.trim();
    if (/^[0-9]{5}$/i.test(value)) {
      console.log("valid zip");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCode: "",
        },
      }));
    } else {
      console.log("invalid zip");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCode: "Enter first 5 digits of US postal code",
        },
      }));
    }
  };

  // Method to validate first 3 digits of US phone number:
  // Get all area codes and loop thru to make sure what's entered is included in this array

  // Method to validate remaining 7 digits of US phone number:

  // Method to validate phone number:
  validatePhoneNumber = (e) => {
    let value = e.target.value.trim();
    if (
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i.test(value)
    ) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phoneNumber: "",
        },
      }));
    } else {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          phoneNumber: "Invalid phone number",
        },
      }));
    }
  };

  render() {
    const { isShippingHidden, toNextPage, itemsInCart, discountRate } =
      this.props;

    // Add onBlur property (the field's validation method, which will be called onBlur) to each object:
    const titleNameAddressDataFields = [
      {
        id: "title",
        label: "Recipient Title: ",
        placeholder: "Recipient title",
        onBlur: this.validateNameCity,
        isRequired: false,
      },
      {
        id: "name",
        label: "Recipient Name: ",
        placeholder: "Recipient name",
        onBlur: this.validateNameCity,
        isRequired: true,
      },
      {
        id: "streetAddress",
        label: "Street Address: ",
        placeholder: "Delivery address",
        onBlur: "",
        isRequired: true,
      },
    ];

    return (
      <div hidden={isShippingHidden}>
        <header className="pageHeader">Shipping</header>
        <form id={style.shippingForm}>
          {/* {titleNameAddressDataFields.map((field) => (
            <label>
              <header>{field.label}</header>
              <input
                required={field.isRequired}
                placeholder={field.placeholder}
                type="text"
                onBlur={field.onBlur}
              />
              {this.state.errors[`${field.id}Error`] && (
                <p>{this.state.errors[`${field.id}Error`]}</p>
              )}
            </label>
          ))} */}
          <div id={style.titleName}>
            <label htmlFor="">
              <header>Title: </header>
              <select id="title">
                <option disabled selected>
                  -- select --
                </option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
                <option value="Dr.">Dr.</option>
                <option value="Lord.">Lord</option>
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
              {this.state.errors.name !== "" && <p>{this.state.errors.name}</p>}
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
              {this.state.errors.city !== "" && <p>{this.state.errors.city}</p>}
            </label>
            <label>
              <header>State: </header>
              <select id="stateOrTerritory">
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
                <option value="UM">United States Minor Outlying Islands</option>
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
          <label>
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
      </div>
    );
  }
}

export default Shipping;
