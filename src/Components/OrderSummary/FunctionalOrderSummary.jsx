import { roundToHundredth } from "../../methods";

const FunctionalOrderSummary = ({
  numberOfItemsInCart,
  itemsInCart,
  summaryTotals,
}) => {
  return (
    <div className="cartSummary">
      <div className="cartSummaryHeaders">
        <header>Order Summary:</header>
        {numberOfItemsInCart === 1 ? (
          <p>{numberOfItemsInCart} item in cart</p>
        ) : (
          <p>{numberOfItemsInCart} items in cart</p>
        )}
      </div>
      <div
        className={
          numberOfItemsInCart > 2 ? "itemsInCartSummarySeveral" : undefined
        }
      >
        <div className="itemsContainer">
          {itemsInCart.map(
            (item) =>
              item.quantity > 0 && (
                <div key={item.itemNameCamelCase} className="itemInCartSummary">
                  <img src={item.itemImage} alt="Item" />
                  <div className="itemDetailsShippingPage">
                    <p>{item.itemName}</p>
                    <p>
                      Category: <span>{item.category}</span>
                    </p>
                    <p>
                      Language: <span>{item.language}</span>
                    </p>
                    <p>
                      Quantity: <span>{item.quantity}</span>
                    </p>
                    <p className="itemInfoHeader">
                      Item Total:
                      <span>
                        {" $" +
                          roundToHundredth(
                            item.quantity * item.unitPrice
                          ).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </span>
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
      <div className="cartSummaryItem">
        {summaryTotals.map((item) => (
          <p key={item.label}>
            {item.label}
            <span>
              {" $" +
                item.value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default FunctionalOrderSummary;
