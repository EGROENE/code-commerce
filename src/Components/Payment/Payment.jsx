import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";
import style from "./Payment.module.css";

class Payment extends React.Component {
  render() {
    const {
      isPaymentHidden,
      completedPages,
      numberOfItemsInCart,
      discountRate,
      toNextPage,
      toPreviousPage,
      shipmentDetails,
      shippingAndHandling,
    } = this.props;
    return (
      <div id="paymentAndConfirmation">
        <div
          className={!isPaymentHidden && "checkoutPageContainer"}
          hidden={isPaymentHidden}
        >
          <ProgressBar completedPages={completedPages} />
          <header className="pageHeader">Payment</header>
          <div id={style.paymentFormContainer}>
            <form id={style.paymentForm}>
              <label htmlFor="">
                <header>Cardholder Name: </header>
                <input
                  type="text"
                  required
                  inputMode="text"
                  placeholder="Enter name as it appears on card"
                />
              </label>
              <label htmlFor="">
                <header>Card Number: </header>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="Enter card number"
                />
              </label>
              <label htmlFor="">
                <header>Expiry Date: </header>
                <select name="" id="">
                  <option disabled selected>
                    Month
                  </option>
                  <option value="01">01</option>
                  <option value="02">02</option>
                  <option value="03">03</option>
                  <option value="04">04</option>
                  <option value="05">05</option>
                  <option value="06">06</option>
                  <option value="07">07</option>
                  <option value="08">08</option>
                  <option value="09">09</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
                <select name="" id="">
                  <option disabled selected>
                    Year
                  </option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                  <option value="2029">2029</option>
                  <option value="2030">2030</option>
                  <option value="2031">2031</option>
                  <option value="2032">2032</option>
                  <option value="2033">2033</option>
                  <option value="2034">2034</option>
                  <option value="2035">2035</option>
                  <option value="2036">2036</option>
                  <option value="2037">2037</option>
                  <option value="2038">2038</option>
                </select>
              </label>
              <label htmlFor="">
                <header>CVV</header>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="Enter 3-digit CVV code"
                />
              </label>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Payment;
