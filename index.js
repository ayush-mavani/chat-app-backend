const env = require("./app/config/env");
const App = require("./server");

App.listen(env.PORT, () => {
  console.log("listening on port " + env.PORT);
});

module.exports = App;
