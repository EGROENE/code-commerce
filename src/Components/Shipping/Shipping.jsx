import React from "react";
import style from "./Shipping.module.css";

class Shipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {
        titleError: "",
        nameError: "",
        streetAddressError: "",
        postalCodeError: "",
      },
    };
  }

  // Method to validate title, name, city:
  validateName = (e) => {
    let value = e.target.value;
    if (/^[a-zA-ZÄäÖöÜüßÉéÍíóÓÑñ -]*$/i.test(value)) {
      console.log("valid ");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          nameError: "",
        },
      }));
    } else {
      console.log("invalid");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          nameError: "Enter only alphabetic characters",
        },
      }));
    }
  };

  // Method to validate street address:

  // Method to validate ZIP code:
  validatePostalCode = (e) => {
    let value = e.target.value;
    if (/^[0-9]{5}$/i.test(value)) {
      console.log("valid zip");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCodeError: "",
        },
      }));
    } else {
      console.log("invalid zip");
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          postalCodeError: "Enter first 5 digits of US postal code",
        },
      }));
    }
  };

  // Method to validate first 3 digits of US phone number:
  // Get all area codes and loop thru to make sure what's entered is included in this array

  // Method to validate remaining 7 digits of US phone number:

  render() {
    const { isShippingHidden, toNextPage, itemsInCart, discountRate } =
      this.props;

    // Add onBlur property (the field's validation method, which will be called onBlur) to each object:
    const titleNameAddressDataFields = [
      {
        id: "title",
        label: "Recipient Title: ",
        placeholder: "Recipient title",
        onBlur: this.validateName,
        isRequired: false,
      },
      {
        id: "name",
        label: "Recipient Name: ",
        placeholder: "Recipient name",
        onBlur: this.validateName,
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
              <select>
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
                  type="text"
                  onBlur={this.validateName}
                  placeholder="Enter recipient name"
                  required
                />
              </div>
              {this.state.errors.nameError && (
                <p>{this.state.errors.nameError}</p>
              )}
            </label>
          </div>
          <label>
            <header>Street address: </header>
            <input type="text" required placeholder="Delivery address" />
          </label>
          <div id={style.moreAddressDetails}>
            <label htmlFor="">
              <header>ZIP Code</header>
              <input
                placeholder="5-digit ZIP code"
                type="text"
                onBlur={this.validatePostalCode}
              />
            </label>
            <label>
              <header>City: </header>
              <input placeholder="Enter city" type="text" />
            </label>
            <label>
              <header>State: </header>
              <select>
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
            <div className={style.phoneNumber}>
              <input placeholder="123" type="text" />
              <input placeholder="4567890" type="text" />
            </div>
          </label>
        </form>
      </div>
    );
  }
}

export default Shipping;
