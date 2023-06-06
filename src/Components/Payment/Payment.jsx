import React from "react";
import ProgressBar from "../ProgressBar/ProgressBar";

class Payment extends React.Component {
  render() {
    const { isPaymentHidden, completedPages } = this.props;
    return (
      <div hidden={isPaymentHidden}>
        <ProgressBar completedPages={completedPages} />
        <header className="pageHeader">Payment</header>
      </div>
    );
  }
}

export default Payment;
