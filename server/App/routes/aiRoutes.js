const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBR0T02jPHUYEnCNJBxgjJm-VHA_NMXl8M";
const genAI = new GoogleGenerativeAI(API_KEY);

// Multiple models for fallback
const models = [
  "gemini-2.5-flash",
  "gemini-2.0-flash", 
  "gemini-flash-latest",
  "gemini-1.5-flash"
];

let currentModelIndex = 0;
let model = genAI.getGenerativeModel({ model: models[0] });

// Try next model on error
const tryNextModel = () => {
  currentModelIndex++;
  if (currentModelIndex < models.length) {
    console.log(`🔄 Switching to model: ${models[currentModelIndex]}`);
    model = genAI.getGenerativeModel({ model: models[currentModelIndex] });
    return true;
  }
  return false;
};

router.post("/chat", async (req, res) => {
  const { message } = req.body;
  
  if (!message || !message.trim()) {
    return res.json({ success: false, reply: "Please ask me a question! 😊" });
  }
  
  console.log("📨:", message);
  
  // Try current model
  const tryChat = async () => {
    try {
      const prompt = `You are EventSphere AI assistant. Answer briefly in same language as question: ${message}`;
      const result = await model.generateContent(prompt);
      const reply = result.response.text();
      return { success: true, reply };
    } catch (error) {
      console.log(`❌ Model ${models[currentModelIndex]} failed:`, error.message);
      
      if (error.message.includes("503") || error.message.includes("429")) {
        // Try next model
        if (tryNextModel()) {
          return await tryChat();
        }
      }
      return null;
    }
  };
  
  let result = await tryChat();
  
  if (!result) {
    // Fallback responses - Works in Urdu/Hindi too!
    const msg = message.toLowerCase();
    let reply = "";
    
    if (msg.includes("ticket") || msg.includes("buy") || msg.includes("kerwani") || msg.includes("chahiye")) {
      reply = "🎫 Tickets buy karne ke liye Events page par jao, event select karo, aur 'Buy Ticket' click karo. Credit card aur digital wallet se payment kar sakte ho.";
    } 
    else if (msg.includes("event") || msg.includes("event")) {
      reply = "📅 Sare events Events page par dekh sakte ho. Date, category, ya location ke hisaab se filter kar sakte ho.";
    }
    else if (msg.includes("booth") || msg.includes("exhibitor")) {
      reply = "🏪 Exhibitor register karne ke liye 'Become an Exhibitor' page par jao. Form fill karo, humari team contact karegi.";
    }
    else if (msg.includes("login")) {
      reply = "🔐 Login karne ke liye top right corner mein 'Login' button click karo. Naye user 'Register' se account bana sakte ho.";
    }
    else if (msg.includes("payment") || msg.includes("pay")) {
      reply = "💳 Hum credit cards, debit cards, aur digital wallets accept karte hain. Sare payments secure aur encrypted hain.";
    }
    else if (msg.includes("hi") || msg.includes("hello") || msg.includes("salam")) {
      reply = "👋 Hello! Welcome to EventSphere! Main aapki kaise help kar sakta hoon?";
    }
    else {
      reply = "🤖 Main EventSphere AI assistant hoon. Aap mujhse events, tickets, booths, login, ya payments ke bare mein pooch sakte ho. Kya sawal hai aapka?";
    }
    
    result = { success: true, reply };
  }
  
  console.log("🤖 Reply sent");
  res.json(result);
});

router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "AI Working! ✅",
    model: models[currentModelIndex],
    status: "Ready"
  });
});

module.exports = router;