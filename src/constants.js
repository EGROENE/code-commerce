import VISA from "./Components/assets/visa.png";
import MASTERCARD from "./Components/assets/masterCard.png";
import AMERICAN_EXPRESS from "./Components/assets/amex.png";
import DISCOVER from "./Components/assets/discover.png";

export const ITEMS_IN_CART = [
  {
    itemName: "The Ultimate JS RegEx Pack",
    itemNameCamelCase: "theUltimateJSRegExPack",
    itemImage:
      "https://d1ozqqh7vh3ykm.cloudfront.net/2023/21/113012875/thumb_96496a1ad239704.png",
    category: "Web Development",
    language: "JavaScript",
    unitPrice: 250.0,
    quantity: 1,
  },
  {
    itemName: "Top 50 CSS Animations Snippets",
    itemNameCamelCase: "top50CSSAnimationsSnippets",
    itemImage:
      "https://d1ozqqh7vh3ykm.cloudfront.net/2023/21/113013054/thumb_a9244058c5c1cb3.png",
    category: "Web Development",
    language: "Cascading Style Sheets",
    unitPrice: 75.0,
    quantity: 2,
  },
  /* {
    itemName: "The Holy JavaScript Bible",
    itemNameCamelCase: "theHolyJavaScriptBible",
    itemImage:
      "https://d1ozqqh7vh3ykm.cloudfront.net/2023/21/113013054/thumb_a9244058c5c1cb3.png",
    category: "Web Development",
    language: "JavaScript",
    unitPrice: 99.99,
    quantity: 1,
  },
  {
    itemName: "All About Git & GitHub",
    itemNameCamelCase: "allAboutGitAndGitHub",
    itemImage:
      "https://d1ozqqh7vh3ykm.cloudfront.net/2023/21/113013054/thumb_a9244058c5c1cb3.png",
    category: "Web Development",
    language: "Git",
    unitPrice: 24.99,
    quantity: 4,
  }, */
];

export const cardRegexPatterns = {
  MASTERCARD: /^5[1-5][0-9]{1,}|^2[2-7][0-9]{1,}$/,
  VISA: /^4[0-9]{2,}$/,
  AMERICAN_EXPRESS: /^3[47][0-9]{5,}$/,
  DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
};

export const cardImages = {
  VISA: VISA,
  MASTERCARD: MASTERCARD,
  AMERICAN_EXPRESS: AMERICAN_EXPRESS,
  DISCOVER: DISCOVER,
};
