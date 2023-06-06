import React from "react";

class ProgressBar extends React.Component {
  render() {
    const { completedPages } = this.props;
    const progressBarElements = [
      {
        class: "fas fa-shopping-cart",
        isCompleted: completedPages.cart,
        isLast: false,
      },
      {
        class: "fas fa-shipping-fast",
        isCompleted: completedPages.shipping,
        isLast: false,
      },
      {
        class: "fas fa-money-check-alt",
        isCompleted: completedPages.payment,
        isLast: false,
      },
      {
        class: "fas fa-check",
        isCompleted: completedPages.confirmation,
        isLast: true,
      },
    ];
    return (
      <div className="progressBar">
        {progressBarElements.map((item) => (
          <div className="progressBarElement">
            <i
              className={
                item.isCompleted ? `${item.class} completed` : item.class
              }
            ></i>
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
