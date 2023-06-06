import React from "react";

class Payment extends React.Component {
  render() {
    const { isPaymentHidden } = this.props;
    console.log(isPaymentHidden);
    return (
      <div hidden={isPaymentHidden}>
        <div className="progressBar">
          <i className="fas fa-shopping-cart completed"></i>
          <div className="progressBarConnector completed"></div>
          <i className="fas fa-shipping-fast completed"></i>
          <div className="progressBarConnector completed"></div>
          <i className="fas fa-money-check-alt"></i>
          <div className="progressBarConnector"></div>
          <i className="fas fa-check"></i>
        </div>
        <header className="pageHeader">Payment</header>
      </div>
    );
  }
}

export default Payment;
