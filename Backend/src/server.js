
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const { checkUnbansOnStart } = require('./utils/unban-check');
const { createDefaultAdmin } = require("./models/adminSetup");
const startUnbanCronjob = require('./cron/autoUnbanCheck');

const app = express();


app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

createDefaultAdmin();
startUnbanCronjob();
checkUnbansOnStart();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Datenbank verbunden"))
  .catch((err) => console.log("Fehler bei der Verbindung zu MongoDB:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server läuft auf http://localhost:${process.env.PORT}`);
});
