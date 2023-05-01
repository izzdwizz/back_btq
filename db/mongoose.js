const mongoose = require("mongoose");

mongoose.connect(
  process.env.CONNECTION_URL,
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("connected to a db");
  }
);
