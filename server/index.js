const express = require("express");
const app = express();
const bodyParder = require("body-parser");
const cors = require("cors");

//middleware
app.use(express.json());
app.use(bodyParder.json());
app.use(bodyParder.urlencoded({ extended: true }));
app.use(cors());
//routes
app.use("/api", require("./routes/server"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
