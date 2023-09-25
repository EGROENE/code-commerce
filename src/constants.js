import VISA from "./Components/assets/visa.png";
import MASTERCARD from "./Components/assets/masterCard.png";
import AMERICAN_EXPRESS from "./Components/assets/amex.png";
import DISCOVER from "./Components/assets/discover.png";

export const registeredAccounts = [
  { email: "richard.t@tmail.com", password: "Password123!" },
  { email: "skristina15@dw.de", password: "Dragonflies34$" },
  { email: "bruce.twarze@abc.com", password: "Ilikedandelions666#" },
];

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
  {
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
  },
];

// Make into array of objects, each containing code and its discount rate:
export const promoInfos = [
  { code: "ilikebeachballs", discountRate: 0.1 },
  { code: "devslopes", discountRate: 0.5 },
  { code: "jd911", discountRate: 0.75 },
  { code: "codeislyfe", discountRate: 0.25 },
  { code: "etlb17", discountRate: 0.99 },
];

export const usStateOptions = [
  { value: "AL", fullName: "Alabama" },
  { value: "AK", fullName: "Alaska" },
  { value: "AS", fullName: "American Samoa" },
  { value: "AZ", fullName: "Arizona" },
  { value: "AR", fullName: "Arkansas" },
  { value: "AA", fullName: "Armed Forces Americas" },
  { value: "AP", fullName: "Armed Forces Pacific" },
  { value: "AE", fullName: "Armed Forces Other" },
  { value: "CA", fullName: "California" },
  { value: "CO", fullName: "Colorado" },
  { value: "CT", fullName: "Connecticut" },
  { value: "DE", fullName: "Delaware" },
  { value: "DC", fullName: "District of Columbia" },
  { value: "FL", fullName: "Florida" },
  { value: "GA", fullName: "Georgia" },
  { value: "GU", fullName: "Guam" },
  { value: "HI", fullName: "Hawai'i" },
  { value: "ID", fullName: "Idaho" },
  { value: "IL", fullName: "Illinois" },
  { value: "IN", fullName: "Indiana" },
  { value: "IA", fullName: "Iowa" },
  { value: "KS", fullName: "Kansas" },
  { value: "KY", fullName: "Kentucky" },
  { value: "LA", fullName: "Louisiana" },
  { value: "ME", fullName: "Maine" },
  { value: "MD", fullName: "Maryland" },
  { value: "MA", fullName: "Massachusetts" },
  { value: "MI", fullName: "Michigan" },
  { value: "MN", fullName: "Minnesota" },
  { value: "MS", fullName: "Mississippi" },
  { value: "MO", fullName: "Missouri" },
  { value: "MT", fullName: "Montana" },
  { value: "MP", fullName: "Northern Mariana Islands" },
  { value: "NE", fullName: "Nebraska" },
  { value: "NV", fullName: "Nevada" },
  { value: "NH", fullName: "New Hampshire" },
  { value: "NJ", fullName: "New Jersey" },
  { value: "NM", fullName: "New Mexico" },
  { value: "NY", fullName: "New York" },
  { value: "NC", fullName: "North Carolina" },
  { value: "ND", fullName: "North Dakota" },
  { value: "OH", fullName: "Ohio" },
  { value: "OK", fullName: "Oklahoma" },
  { value: "OR", fullName: "Oregon" },
  { value: "PA", fullName: "Pennsylvania" },
  { value: "PR", fullName: "Puerto Rico" },
  { value: "RI", fullName: "Rhode Island" },
  { value: "SC", fullName: "South Carolina" },
  { value: "SD", fullName: "South Dakota" },
  { value: "TN", fullName: "Tennessee" },
  { value: "TX", fullName: "Texas" },
  { value: "UM", fullName: "United States Minor Outlying Islands" },
  { value: "VI", fullName: "US Virgin Islands" },
  { value: "UT", fullName: "Utah" },
  { value: "VT", fullName: "Vermont" },
  { value: "VA", fullName: "Virginia" },
  { value: "WA", fullName: "Washington" },
  { value: "WV", fullName: "West Virginia" },
  { value: "WI", fullName: "Wisconsin" },
  { value: "WY", fullName: "Wyoming" },
];

export const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];

export const years = [
  "2023",
  "2024",
  "2025",
  "2026",
  "2027",
  "2028",
  "2029",
  "2030",
  "2031",
  "2032",
  "2033",
  "2034",
  "2035",
  "2036",
  "2037",
  "2038",
  "2039",
  "2040",
  "2041",
  "2042",
  "2043",
  "2044",
  "2045",
  "2046",
  "2047",
  "2048",
  "2049",
  "2050",
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
