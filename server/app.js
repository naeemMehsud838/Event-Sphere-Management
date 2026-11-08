const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const cookieParser = require("cookie-parser");

// ✅ PEHLE app initialize karo
const app = express();

// ✅ Serve uploaded files statically (AB YEH SAHI HAI)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS setup
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Debug middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  if (req.method === 'POST' && req.body && Object.keys(req.body).length > 0) {
    console.log("📥 Body:", req.body);
  }
  next();
});

// ✅ Routes

const boothRoutes = require("./App/routes/boothRoutes");
const adminRoutes = require("./App/routes/adminRoutes");
const userRoutes = require("./App/routes/userRoutes");
const ticketRoutes = require("./App/routes/ticketRoutes");
 
 const messageRoutes = require("./App/routes/messageRoutes");
 const eventRoutes = require("./App/routes/eventRoutes");
const sessionRoutes = require("./App/routes/sessionRoutes");
const aiRoutes = require('./App/routes/aiRoutes');



app.use('/api/ai', aiRoutes);
app.use('/api/sessions', sessionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/booths", boothRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/events", eventRoutes);

 

// ✅ Test route
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running on port 1100" });
});

// ✅ Database connection
const DBURL = process.env.DBURL || "mongodb://localhost:27017/event_management";

mongoose.connect(DBURL)
  .then(() => {
    console.log("✅ DB Connected");
    const PORT = process.env.PORT || 1100;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 Admin API: http://localhost:${PORT}/api/admin`);
      console.log(`👥 User API: http://localhost:${PORT}/api/users`);
      console.log(`🎫 Tickets API: http://localhost:${PORT}/api/tickets`);
    });
  })
  .catch(err => {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  });