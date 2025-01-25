const { Http } = require("./server");
const env = require("./app/config/env");

Http.listen(env.PORT, () => {
  console.log("listening on port " + env.PORT);
});

module.exports = Http;
