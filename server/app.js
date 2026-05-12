const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const authRoutes = require("./App/routes/authRoutes");
const expoRoutes = require("./App/routes/expoRoutes");
const expoRoutes = require("./App/routes/expoRoutes");

const app = express();



require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",

    ],
    credentials: true
}));
app.use(
  session({
    secret: "mysupersecretkey",

    resave: false,

    saveUninitialized: false,

    store: MongoStore.create({
  mongoUrl: process.env.DBURL,
}),

    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
// Routes
app.use("/api/auth/", authRoutes);
app.use("/api/expos/", expoRoutes);
app.use("/api/booths", boothRoutes);

// Database Connection
mongoose.connect(process.env.DBURL)
.then(() => {
    console.log("Database Has Been Connected.");

    app.listen(process.env.PORT || 1100, () => {
        console.log(`Server is running on port ${process.env.PORT || 1100}`);
    });

})
.catch((err) => {
    console.log("Error While Connecting:", err);
});

module.exports = app;