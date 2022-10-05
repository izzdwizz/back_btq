const mongoose = require("mongoose");

mongoose.connect(
  process.env.CONNECTION_URL,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("connected to a db");
  }
);
