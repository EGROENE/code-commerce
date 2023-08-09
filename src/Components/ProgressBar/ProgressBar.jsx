import React from "react";

class ProgressBar extends React.Component {
  render() {
    // Destructure props:
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
      },
      {
        id: "Shipping",
        class: "fas fa-shipping-fast",
        isCompleted: isShippingCompleted,
      },
      {
        id: "Payment",
        class: "fas fa-money-check-alt",
        isCompleted: isPaymentCompleted,
      },
      {
        id: "Confirmation",
        class: "fas fa-check",
        isCompleted: isConfirmationCompleted,
      },
    ];

    const isElementLast = (element) => {
      return progressBarElements.indexOf(element) ===
        progressBarElements.length - 1
        ? true
        : false;
    };

    return (
      <div className="progressBar">
        {progressBarElements.map((item) => (
          <div key={item.id} className="progressBarElement">
            <div>
              <i
                className={
                  item.isCompleted ? "fas fa-check completed" : item.class
                }
              ></i>
              <p>{item.id}</p>
            </div>
            {!isElementLast(item) && (
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
