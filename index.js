const env = require("./app/config/env");
const Http = require("./server");

Http.listen(env.PORT, () => {
  console.log("listening on port " + env.PORT);
});

module.exports = Http;
