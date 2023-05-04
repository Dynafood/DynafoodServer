const ingredientId = "en:sweetener"; // Example ingredient ID
const apiUrl = `https://world.openfoodfacts.org/ingredient/${ingredientId}.json`;
let axios = require("axios");
axios.get(apiUrl)
  .then(data => {
    console.log(Object.keys(data.data.products[0]));
    console.log(Object.keys(data.data));
    // Process the ingredient data as needed
  })
  .catch(error => console.error(error));