import React from "react";

class ProgressBar extends React.Component {
  render() {
    const {
      completedPages,
      isShippingCompleted,
      isPaymentCompleted,
      isConfirmationCompleted,
    } = this.props;
    const progressBarElements = [
      {
        id: "Cart",
        class: "fas fa-shopping-cart",
        isCompleted: completedPages.cart,
        isLast: false,
      },
      {
        id: "Shipping",
        class: "fas fa-shipping-fast",
        isCompleted: isShippingCompleted,
        isLast: false,
      },
      {
        id: "Payment",
        class: "fas fa-money-check-alt",
        isCompleted: isPaymentCompleted,
        isLast: false,
      },
      {
        id: "Confirmation",
        class: "fas fa-check",
        isCompleted: isConfirmationCompleted,
        isLast: true,
      },
    ];
    return (
      <div className="progressBar">
        {progressBarElements.map((item) => (
          <div className="progressBarElement">
            <div>
              <i
                className={
                  item.isCompleted ? "fas fa-check completed" : item.class
                }
              ></i>
              <p>{item.id}</p>
            </div>
            {!item.isLast && (
              <div
                className={
                  item.isCompleted
                    ? "progressBarConnector completed"
                    : "progressBarConnector"
                }
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default ProgressBar;
