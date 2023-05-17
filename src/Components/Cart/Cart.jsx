import React from "react";

class Cart extends React.Component {
  constructor() {
    super();
    this.state = {
      totalItemPrices: {
        hawaiianRainbowWomensTee: 24.99,
        alaskanSkyMensTee: 29.99,
      },
    };
  }

  // Method to get total price for each item (quantity x price):
  // Assign calc to state value
  // Run onChange of quantity input field
  // Round to 2 decimals!
  // Also, quantity only appears when number is changed, so maybe run this method on pageload or set quantity as state value for each item
  getTotalItemPrice = (e, unitPrice, itemName) => {
    let quantity = e.target.value;
    let totalItemPrice = quantity * unitPrice;
    this.setState((prevState) => ({
      totalItemPrices: {
        ...prevState.totalItemPrices,
        [itemName]: totalItemPrice,
      },
    }));
  };

  render() {
    const { isCartHidden } = this.props;

    const itemsAddedToCart = [
      {
        itemName: "Hawaiian Rainbow Women's Tee",
        itemNameCamelCase: "hawaiianRainbowWomensTee",
        itemImage:
          "https://d1ozqqh7vh3ykm.cloudfront.net/2022/38/95478030/thumb_97286a023d362e1.png",
        gender: "Women",
        color: "Leaf Green",
        size: "S",
        unitPrice: 24.99,
        totalItemPrice: 24.99,
      },
      /* {
        itemName: "Desert Sunset Women's Eco Tee",
        itemImage:
          "https://d1ozqqh7vh3ykm.cloudfront.net/2022/29/91393993/thumb_3ddf445c967ab8d.png",
        gender: "Women",
        color: "Navy Blue",
        size: "M",
        unitPrice: 29.99,
        totalItemPrice: 29.99,
      }, */
      /* {
        itemName: "Jamaican Logo Women's Tee",
        itemImage:
          "https://d1ozqqh7vh3ykm.cloudfront.net/2021/50/76865028/thumb_bf3c96108c3aebe.png",
        gender: "Women",
        color: "White",
        size: "M",
        unitPrice: 24.99,
        totalItemPrice: 24.99,
      }, */
      {
        itemName: "Alaskan Sky Men's Tee",
        itemNameCamelCase: "alaskanSkyMensTee",
        itemImage:
          "https://d1ozqqh7vh3ykm.cloudfront.net/2021/14/56822314/thumb_afe8edd43024014.png",
        gender: "Men",
        color: "All-Over",
        size: "M",
        unitPrice: 29.99,
        totalItemPrice: 29.99,
      },
      /* {
        itemName: "Hibiscus Men's Tee",
        itemNameCamelCase: "hibiscusMensTee",
        itemImage:
          "https://d1ozqqh7vh3ykm.cloudfront.net/2021/08/52293478/thumb_8ba849f7b657f8f.png",
        gender: "Men",
        color: "Mint Green",
        size: "L",
        unitPrice: 19.99,
        totalItemPrice: 19.99,
      }, */
    ];

    return (
      <div hidden={isCartHidden}>
        <h1>Cart</h1>
        <div id="cartPageContainer">
          <div id="itemsInCart">
            {itemsAddedToCart.map((item) => (
              <div id={item.itemName} className="itemInCart">
                <img alt="" src={item.itemImage} />
                <div id="itemInfo">
                  <p>{item.gender}</p>
                  <p>{item.itemName}</p>
                  <p>Color: {item.color}</p>
                  <p>Size: {item.size}</p>
                </div>
                <p>{item.unitPrice}</p>
                <input
                  type="number"
                  min={1}
                  step={1}
                  //onChange={this.getTotalItemPrice(item.unitPrice)}
                  onChange={(e) =>
                    this.getTotalItemPrice(
                      e,
                      item.unitPrice,
                      item.itemNameCamelCase
                    )
                  }
                />
                <p>{this.state.totalItemPrices[`${item.itemNameCamelCase}`]}</p>
              </div>
            ))}
          </div>
          <div id="cartSummary"></div>
        </div>
      </div>
    );
  }
}

export default Cart;
