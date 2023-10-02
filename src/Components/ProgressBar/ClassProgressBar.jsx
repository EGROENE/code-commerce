import React from "react";

class ClassProgressBar extends React.Component {
  render() {
    // Destructure props:
    const { arePagesComplete } = this.props;

    const progressBarElements = [
      {
        id: "Cart",
        class: "fas fa-shopping-cart",
        isCompleted: arePagesComplete.isCartComplete,
      },
      {
        id: "Shipping",
        class: "fas fa-shipping-fast",
        isCompleted: arePagesComplete.isShippingComplete,
      },
      {
        id: "Payment",
        class: "fas fa-money-check-alt",
        isCompleted: arePagesComplete.isPaymentComplete,
      },
      {
        id: "Confirmation",
        class: "fas fa-check",
        isCompleted: arePagesComplete.isPaymentComplete,
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

export default ClassProgressBar;
