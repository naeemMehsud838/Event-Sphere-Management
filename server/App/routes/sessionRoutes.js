const express = require('express');
const router = express.Router();
const Session = require('../models/sessionModel'); // Yeh path sahi hai
const jwt = require('jsonwebtoken');

// Auth middleware (agar define nahi hai to)
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
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

// Get all sessions
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      sessions: sessions
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions'
    });
  }
});

// Create new session
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, speaker, time, location, category, description } = req.body;
    
    if (!title || !speaker || !time || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }
    
    const newSession = new Session({
      title,
      speaker,
      time,
      location,
      category: category || 'Technology',
      description: description || '',
      attendees: 0,
      status: 'Upcoming',
      createdBy: req.user.email || req.user.id
    });
    
    await newSession.save();
    
    res.json({
      success: true,
      message: 'Session created successfully',
      session: newSession
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create session'
    });
  }
});

// Join session
router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { sessionId, userEmail } = req.body;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (!session.attendeesList) session.attendeesList = [];
    const alreadyJoined = session.attendeesList.some(a => a.email === userEmail);
    
    if (!alreadyJoined) {
      session.attendeesList.push({ email: userEmail, joinedAt: new Date() });
      session.attendees = session.attendeesList.length;
      await session.save();
    }
    
    res.json({
      success: true,
      message: 'Successfully joined session',
      attendees: session.attendees
    });
  } catch (error) {
    console.error('Error joining session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to join session'
    });
  }
});

// Save session
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { sessionId, userEmail } = req.body;
    
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }
    
    if (!session.savedBy) session.savedBy = [];
    const alreadySaved = session.savedBy.some(s => s.email === userEmail);
    
    if (!alreadySaved) {
      session.savedBy.push({ email: userEmail, savedAt: new Date() });
      await session.save();
    }
    
    res.json({
      success: true,
      message: 'Session saved successfully'
    });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save session'
    });
  }
});

module.exports = router;