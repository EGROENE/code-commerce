import React from "react";

class ProgressBar extends React.Component {
  render() {
    const { completedPages } = this.props;
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
        isCompleted: completedPages.shipping,
        isLast: false,
      },
      {
        id: "Payment",
        class: "fas fa-money-check-alt",
        isCompleted: completedPages.payment,
        isLast: false,
      },
      {
        id: "Confirmation",
        class: "fas fa-check",
        isCompleted: completedPages.confirmation,
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
