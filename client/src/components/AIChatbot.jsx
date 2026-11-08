// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { MessageCircle, X, Send, Mic, Minimize2 } from "lucide-react";
// import "./AIChatbot.css";

// export default function AIChatbot() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "👋 Hello! I'm your AI assistant for EventSphere. How can I help you today?",
//       sender: "bot",
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Common questions and answers
//   const botResponses = {
//     "event": "You can browse all events from the Events page. Click on 'Events' in the navigation menu to see upcoming events.",
//     "ticket": "To buy a ticket, go to the Events page, select an event, and click 'Buy Ticket'. You can pay via credit card or digital wallet.",
//     "booth": "For booth registration, exhibitors can go to the 'Become an Exhibitor' page and fill out the registration form.",
//     "login": "Click on the 'Login' button in the top right corner. If you don't have an account, click 'Register' to create one.",
//     "password": "On the login page, click 'Forgot Password'. You'll receive an email with instructions to reset your password.",
//     "payment": "We accept credit cards, debit cards, and digital wallets. All payments are secure and encrypted.",
//     "refund": "Refunds are available within 7 days of purchase. Contact support@eventsphere.com for refund requests.",
//     "support": "You can contact our support team at support@eventsphere.com or call +1 (555) 123-4567",
//     "schedule": "Event schedules are available on each event's detail page. You can also download the schedule as PDF.",
//     "venue": "Venue details including location, parking, and directions are available on each event's page.",
//     "speaker": "Speaker information is listed on the event details page. Click on a speaker to see their bio and session times.",
//     "networking": "We have a networking feature! Check the 'Networking' section to connect with other attendees and exhibitors.",
//     "default": "I'm here to help! You can ask me about events, tickets, booths, login issues, payments, or anything else about EventSphere."
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const getBotResponse = (userMessage) => {
//     const lowerMessage = userMessage.toLowerCase();
    
//     // Check for keywords
//     if (lowerMessage.includes("event") || lowerMessage.includes("events")) {
//       return botResponses.event;
//     } else if (lowerMessage.includes("ticket") || lowerMessage.includes("buy") || lowerMessage.includes("purchase")) {
//       return botResponses.ticket;
//     } else if (lowerMessage.includes("booth") || lowerMessage.includes("exhibitor")) {
//       return botResponses.booth;
//     } else if (lowerMessage.includes("login") || lowerMessage.includes("sign in")) {
//       return botResponses.login;
//     } else if (lowerMessage.includes("password") || lowerMessage.includes("forgot")) {
//       return botResponses.password;
//     } else if (lowerMessage.includes("payment") || lowerMessage.includes("pay")) {
//       return botResponses.payment;
//     } else if (lowerMessage.includes("refund") || lowerMessage.includes("return")) {
//       return botResponses.refund;
//     } else if (lowerMessage.includes("support") || lowerMessage.includes("help")) {
//       return botResponses.support;
//     } else if (lowerMessage.includes("schedule") || lowerMessage.includes("time")) {
//       return botResponses.schedule;
//     } else if (lowerMessage.includes("venue") || lowerMessage.includes("location")) {
//       return botResponses.venue;
//     } else if (lowerMessage.includes("speaker")) {
//       return botResponses.speaker;
//     } else if (lowerMessage.includes("network") || lowerMessage.includes("connect")) {
//       return botResponses.networking;
//     } else if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
//       return "Hello! 👋 Welcome to EventSphere! How can I assist you today?";
//     } else {
//       return botResponses.default;
//     }
//   };

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     // Add user message
//     const userMessage = {
//       id: messages.length + 1,
//       text: input,
//       sender: "user",
//       timestamp: new Date()
//     };
//     setMessages(prev => [...prev, userMessage]);
//     setInput("");
//     setIsTyping(true);

//     // Simulate AI thinking
//     setTimeout(() => {
//       const botResponse = getBotResponse(input);
//       const botMessage = {
//         id: messages.length + 2,
//         text: botResponse,
//         sender: "bot",
//         timestamp: new Date()
//       };
//       setMessages(prev => [...prev, botMessage]);
//       setIsTyping(false);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !isTyping) {
//       sendMessage();
//     }
//   };

//   const suggestedQuestions = [
//     "How to buy tickets?",
//     "Booth registration process",
//     "Login help",
//     "Payment methods",
//     "Contact support"
//   ];

//   return (
//     <>
//       {/* Chat Button */}
//       {!isOpen && (
//         <motion.button
//           className="ai-chat-button"
//           onClick={() => setIsOpen(true)}
//           initial={{ scale: 0 }}
//           animate={{ scale: 1 }}
//           whileHover={{ scale: 1.1 }}
//         >
//           <MessageCircle size={28} />
//           <span className="chat-badge">AI</span>
//         </motion.button>
//       )}

//       {/* Chat Window */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             className="ai-chat-window"
//             initial={{ opacity: 0, y: 100, scale: 0.8 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: 100, scale: 0.8 }}
//           >
//             {/* Header */}
//             <div className="chat-header">
//               <div className="chat-header-info">
//                 <div className="ai-avatar">🤖</div>
//                 <div>
//                   <h3>AI Assistant</h3>
//                   <p>Online • Ready to help</p>
//                 </div>
//               </div>
//               <div className="chat-actions">
//                 {/* <button onClick={() => setIsOpen(false)} className="minimize-btn"> */}
//                   {/* <Minimize2 size={18} /> */}
//                 {/* </button> */}
//                 <button onClick={() => setIsOpen(false)} className="close-btn">
//                   <X size={18} />
//                 </button>
//               </div>
//             </div>

//             {/* Messages */}
//             <div className="chat-messages">
//               {messages.map((msg) => (
//                 <div key={msg.id} className={`message ${msg.sender}`}>
//                   <div className="message-bubble">
//                     <p>{msg.text}</p>
//                     <span className="message-time">
//                       {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="message bot">
//                   <div className="typing-indicator">
//                     <span></span>
//                     <span></span>
//                     <span></span>
//                   </div>
//                 </div>
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Suggested Questions */}
//             {messages.length < 3 && (
//               <div className="suggested-questions">
//                 <p>Suggested questions:</p>
//                 <div className="suggestions-list">
//                   {suggestedQuestions.map((q, i) => (
//                     <button
//                       key={i}
//                       onClick={() => {
//                         setInput(q);
//                         setTimeout(() => sendMessage(), 100);
//                       }}
//                     >
//                       {q}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Input */}
//             <div className="chat-input">
//               <input
//                 type="text"
//                 placeholder="Type your question..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 disabled={isTyping}
//               />
//               <button onClick={sendMessage} disabled={isTyping}>
//                 <Send size={18} />
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }





import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";
import "./AIChatbot.css";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hello! I'm your AI assistant for EventSphere. How can I help you today?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message to AI API - ONLY ONE FUNCTION (NO DUPLICATE)
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Simple API call without history (to avoid format errors)
      const response = await axios.post(
        "http://localhost:1000/api/ai/chat",
        {
          message: input
          // Don't send history - it causes errors
        }
      );

      if (response.data.success) {
        const botMessage = {
          id: messages.length + 2,
          text: response.data.reply,
          sender: "bot",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error("API Error");
      }
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback response
      const fallbackMessage = {
        id: messages.length + 2,
        text: "I'm here to help! You can ask me about events, tickets, booths, login issues, or payments. How can I assist you today?",
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isTyping) {
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "How to buy tickets?",
    "Booth registration process",
    "Login help",
    "Payment methods",
    "Upcoming events"
  ];

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          className="ai-chat-button"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <MessageCircle size={28} />
          <span className="chat-badge">AI</span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat-window"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="ai-avatar">🤖</div>
                <div>
                  <h3>AI Assistant</h3>
                  <p>Powered by Gemini AI • Online</p>
                </div>
              </div>
              <div className="chat-actions">
                <button onClick={() => setIsOpen(false)} className="close-btn">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message bot">
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length < 3 && (
              <div className="suggested-questions">
                <p>Suggested questions:</p>
                <div className="suggestions-list">
                  {suggestedQuestions.map((q, i) => (
                    <button key={i} onClick={() => {
                      setInput(q);
                      setTimeout(() => sendMessage(), 100);
                    }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="chat-input">
              <input
                type="text"
                placeholder="Ask me anything about EventSphere..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              <button onClick={sendMessage} disabled={isTyping}>
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}