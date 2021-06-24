const axios = require("axios")
module.exports = {
    name: "wyr",
    description: "Check bot ping",
    run: async({respond}) => {

      let res = await axios.get("https://api.tovade.xyz/v1/fun/wyr")

      console.log(res)

      
        respond("pog");
  }
};