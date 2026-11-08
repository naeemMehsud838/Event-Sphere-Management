const express = require("express");
const router = express.Router();
const Message = require("../models/messageModel");
const jwt = require("jsonwebtoken");

// ================= AUTH MIDDLEWARE (DEFINE KARO) =================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    // For testing - allow without token (temporary)
    req.user = { id: "test", email: "test@test.com", role: "user" };
    return next();
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    req.user = decoded;
    next();
  } catch (error) {
    req.user = { id: "test", email: "test@test.com", role: "user" };
    next();
  }
};

// ================= GET USER'S OWN MESSAGES (BY EMAIL) =================
router.get("/user/:email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log("🔍 Fetching messages for email:", email);

    const messages = await Message.find({ 
      $or: [
        { email: email },           // Messages sent by this user
        { recipientEmail: email }   // Messages received by this user
      ]
    }).sort({ createdAt: 1 });

    console.log(`📨 Found ${messages.length} messages for ${email}`);

    res.json({
      success: true,
      count: messages.length,
      messages: messages,
    });
  } catch (error) {
    console.error("Fetch user messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// ================= GET EXHIBITOR MESSAGES =================
router.get("/exhibitor/:email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log("🔍 Fetching messages for exhibitor:", email);

    const messages = await Message.find({ 
      $or: [
        { email: email },           // Messages sent by exhibitor
        { recipientEmail: email }   // Messages received by exhibitor
      ]
    }).sort({ createdAt: 1 });

    console.log(`📨 Found ${messages.length} messages for exhibitor ${email}`);

    res.json({
      success: true,
      count: messages.length,
      messages: messages,
    });
  } catch (error) {
    console.error("Fetch exhibitor messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// ================= SEND NEW MESSAGE (USER/ATTENDEE TO ADMIN) =================
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { message, subject } = req.body;
    
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    const User = require("../models/userModel");
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const newMessage = new Message({
      name: user.name,
      email: user.email,
      recipientEmail: "admin@eventsphere.com",
      message: message,
      subject: subject || "General",
      status: "unread",
      isRead: false,
      direction: "outgoing",
      role: user.role || "attendee"
    });

    await newMessage.save();

    console.log(`📨 New message from ${user.name} (${user.email})`);

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      messageData: newMessage
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// ================= SEND MESSAGE AS EXHIBITOR =================
router.post("/exhibitor/send", authMiddleware, async (req, res) => {
  try {
    const { message, subject, email, name } = req.body;
    
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const newMessage = new Message({
      name: name || "Exhibitor",
      email: email,
      recipientEmail: "admin@eventsphere.com",
      message: message,
      subject: subject || "Booth Support",
      status: "unread",
      isRead: false,
      direction: "outgoing",
      role: "exhibitor"
    });
    
    await newMessage.save();
    
    console.log(`📨 New message from exhibitor ${email}`);
    
    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      messageData: newMessage
    });
  } catch (error) {
    console.error("Send exhibitor message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
});

// ================= ADMIN: SEND REPLY =================
router.post("/admin/reply/:parentId", authMiddleware, async (req, res) => {
  try {
    const { parentId } = req.params;
    const { replyMessage } = req.body;
    
    // Get the parent message to know who to reply to
    const parentMessage = await Message.findById(parentId);
    
    if (!parentMessage) {
      return res.status(404).json({
        success: false,
        message: "Original message not found",
      });
    }

    if (!replyMessage || !replyMessage.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    // Create a new message as reply
    const reply = new Message({
      name: "Admin Support",
      email: "admin@eventsphere.com",
      recipientEmail: parentMessage.email,  // Send reply to original sender
      message: replyMessage,
      subject: `Re: ${parentMessage.subject}`,
      status: "read",
      isRead: true,
      parentId: parentId,
      direction: "incoming",
      role: "admin",
      repliedAt: new Date(),
    });

    await reply.save();

    // Update parent message status
    parentMessage.status = "replied";
    parentMessage.repliedAt = new Date();
    parentMessage.replyMessage = replyMessage;
    await parentMessage.save();

    console.log(`📨 Admin replied to ${parentMessage.email}`);

    res.status(201).json({
      success: true,
      message: "Reply sent successfully!",
      reply: reply
    });
  } catch (error) {
    console.error("Reply error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reply",
    });
  }
});

// ================= ADMIN: GET ALL MESSAGES =================
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });

    const unreadCount = messages.filter(m => !m.isRead && m.recipientEmail === "admin@eventsphere.com").length;

    console.log(`📨 Admin fetch: ${messages.length} total messages, ${unreadCount} unread`);

    res.json({
      success: true,
      count: messages.length,
      unreadCount: unreadCount,
      messages: messages,
    });
  } catch (error) {
    console.error("Fetch all messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// ================= MARK MESSAGE AS READ =================
router.put("/admin/read/:id", authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true, status: "read" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
    });
  }
});

// ================= DELETE MESSAGE =================
router.delete("/admin/delete/:id", authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
});

// ================= GET CONVERSATION BETWEEN USER AND ADMIN =================
router.get("/conversation/:email", authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    
    const messages = await Message.find({
      $or: [
        { email: email, recipientEmail: "admin@eventsphere.com" },
        { email: "admin@eventsphere.com", recipientEmail: email }
      ]
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      count: messages.length,
      messages: messages,
    });
  } catch (error) {
    console.error("Fetch conversation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
    });
  }
});

module.exports = router;