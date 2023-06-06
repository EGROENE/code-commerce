import React from "react";

class ProgressBar extends React.Component {
  render() {
    const { completedPages } = this.props;
    console.log(completedPages);
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
        {/* <i className="fas fa-shopping-cart completed"></i>
        <div className="progressBarConnector completed"></div>
        <i className="fas fa-shipping-fast completed"></i>
        <div className="progressBarConnector completed"></div>
        <i className="fas fa-money-check-alt"></i>
        <div className="progressBarConnector"></div>
        <i className="fas fa-check"></i> */}
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
