const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Simple middleware for testing (no import needed)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    // For testing - allow without token
    req.user = { id: "test", email: "test@test.com", role: "user" };
    return next();
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey123");
    req.user = decoded;
    next();
  } catch (error) {
    req.user = { id: "test", email: "test@test.com", role: "user" };
    next();
  }
};

// Get messages for exhibitor
router.get('/exhibitor/:email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    
    const messages = await Message.find({
      $or: [
        { email: email },
        { receiverEmail: email }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Send message as exhibitor
router.post('/exhibitor/send', authMiddleware, async (req, res) => {
  try {
    const { message, subject, email, name } = req.body;
    
    const newMessage = new Message({
      message: message,
      subject: subject || 'Booth Support',
      email: email,
      name: name,
      receiverEmail: 'admin@eventsphere.com',
      status: 'unread',
      role: 'exhibitor'
    });
    
    await newMessage.save();
    
    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Get messages for user
router.get('/user/:email', authMiddleware, async (req, res) => {
  try {
    const { email } = req.params;
    
    const messages = await Message.find({
      $or: [
        { email: email },
        { receiverEmail: email }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// Send message
router.post('/send', authMiddleware, async (req, res) => {
  try {
    const { message, subject, email, name } = req.body;
    
    const newMessage = new Message({
      message: message,
      subject: subject || 'Support',
      email: email,
      name: name,
      receiverEmail: 'admin@eventsphere.com',
      status: 'unread',
      role: 'attendee'
    });
    
    await newMessage.save();
    
    res.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// Get all messages (admin)
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

module.exports = router;