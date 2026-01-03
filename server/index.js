require("dotenv").config(); 
const express = require("express");
const connectDB = require("./utils/db");

const auth = require("./routes/auth.routes");
const voteRoutes = require("./routes/vote.routes");

const app = express();

connectDB(); 

app.use(express.json());


app.use("/api/auth", auth.router);
app.use("/api/vote", voteRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
