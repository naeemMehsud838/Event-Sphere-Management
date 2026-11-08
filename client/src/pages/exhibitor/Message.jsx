import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Message.css";

export default function ExhibitorMessage() {
  const [activeChat, setActiveChat] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [exhibitor, setExhibitor] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Get logged in exhibitor
  useEffect(() => {
    // Try to get exhibitor from different possible storage keys
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const storedExhibitor = JSON.parse(localStorage.getItem("exhibitor") || "{}");
    
    if (storedUser && storedUser.email) {
      console.log("🔐 Found user:", storedUser);
      setExhibitor(storedUser);
    } else if (storedExhibitor && storedExhibitor.email) {
      console.log("🔐 Found exhibitor:", storedExhibitor);
      setExhibitor(storedExhibitor);
    } else {
      // Try to get from token
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const decoded = JSON.parse(atob(base64));
          console.log("📝 Decoded from token:", decoded);
          setExhibitor({
            email: decoded.email,
            name: decoded.name || decoded.fullName || "Exhibitor",
            role: decoded.role
          });
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }
    }
  }, []);

  // Load all conversations - USING USER ENDPOINT
  const loadConversations = async () => {
    if (!exhibitor?.email) return;
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("📡 Fetching messages for exhibitor using user endpoint:", exhibitor.email);

      // CHANGE: Using /user/ endpoint instead of /exhibitor/
      const response = await axios.get(
        `http://localhost:1000/api/messages/user/${exhibitor.email}`,
        config
      );

      console.log("📨 Response:", response.data);

      if (response.data.success && response.data.messages) {
        const exhibitorMessages = response.data.messages;
        
        if (exhibitorMessages.length === 0) {
          setConversations([]);
          setMessages([]);
          return;
        }

        // Group messages by subject
        const grouped = {};
        exhibitorMessages.forEach(msg => {
          const subject = msg.subject || "Booth Support";
          if (!grouped[subject]) {
            grouped[subject] = {
              name: subject,
              messages: [],
              unread: 0,
              lastDate: msg.createdAt
            };
          }
          grouped[subject].messages.push(msg);
          if (msg.status === "unread" && msg.email === exhibitor.email) {
            grouped[subject].unread++;
          }
          if (new Date(msg.createdAt) > new Date(grouped[subject].lastDate)) {
            grouped[subject].lastDate = msg.createdAt;
          }
        });
        
        // Convert to array and sort
        let convList = Object.values(grouped);
        convList.forEach(conv => {
          conv.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          const lastMsg = conv.messages[conv.messages.length - 1];
          conv.last = lastMsg?.message?.substring(0, 40) + "...";
        });
        convList.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
        
        setConversations(convList);
        
        // Load first chat messages
        if (convList.length > 0 && activeChat === 0) {
          loadChatMessages(convList[0]);
        } else if (convList[activeChat]) {
          loadChatMessages(convList[activeChat]);
        }
      } else {
        setConversations([]);
        setMessages([]);
      }
    } catch (error) {
      console.error("Load conversations error:", error);
      if (error.response?.status === 404) {
        toast.warning("Message service not available. Please contact admin.");
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to load messages");
      }
      setConversations([]);
    }
  };

  // Load messages for selected chat - USING USER ENDPOINT
  const loadChatMessages = async (chat) => {
    if (!chat || !exhibitor?.email) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // CHANGE: Using /user/ endpoint
      const response = await axios.get(
        `http://localhost:1000/api/messages/user/${exhibitor.email}`,
        config
      );

      if (response.data.success && response.data.messages) {
        const chatMessages = response.data.messages.filter(msg => 
          (msg.subject || "Booth Support") === chat.name
        );
        
        const allMessages = [];
        
        chatMessages.forEach(msg => {
          // Message from exhibitor
          if (msg.email === exhibitor.email && msg.message) {
            allMessages.push({
              from: "me",
              text: msg.message,
              timestamp: msg.createdAt
            });
          }
          
          // Reply from admin
          if (msg.email !== exhibitor.email && msg.message) {
            allMessages.push({
              from: "them",
              text: msg.message,
              timestamp: msg.createdAt
            });
          }
        });
        
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(allMessages);
      }
    } catch (error) {
      console.error("Load chat messages error:", error);
      setMessages([]);
    }
  };

  // Send message to admin - USING USER ENDPOINT
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!exhibitor?.email) {
      toast.error("Please login to send message");
      return;
    }

    setLoading(true);
    const messageText = input.trim();
    const currentSubject = conversations[activeChat]?.name || "Booth Support";

    try {
      const token = localStorage.getItem("token");
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        } 
      };

      // CHANGE: Using /user/send or /send endpoint instead of /exhibitor/send
      const response = await axios.post(
        "http://localhost:1000/api/messages/send",
        {
          message: messageText,
          subject: currentSubject,
          email: exhibitor.email,
          name: exhibitor.name || exhibitor.companyName || exhibitor.fullName || "Exhibitor"
        },
        config
      );

      if (response.data.success) {
        // Add message to UI immediately
        const newMessage = { 
          from: "me", 
          text: messageText, 
          timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMessage]);
        setInput("");
        toast.success("Message sent to admin!");
        
        // Update conversation preview
        if (conversations[activeChat]) {
          const updatedConversations = [...conversations];
          updatedConversations[activeChat].last = messageText.substring(0, 40) + "...";
          updatedConversations[activeChat].lastDate = new Date().toISOString();
          setConversations(updatedConversations);
        }
        
        // Refresh in background
        setTimeout(() => {
          loadConversations();
        }, 1000);
      } else {
        toast.error(response.data.message || "Failed to send");
      }
    } catch (error) {
      console.error("Send error:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  // Create new conversation
  const createNewConversation = () => {
    const newName = `Booth Support ${conversations.length + 1}`;
    const newConv = {
      name: newName,
      last: "Start a conversation...",
      messages: [],
      unread: 0,
      lastDate: new Date().toISOString()
    };
    const newConversations = [...conversations, newConv];
    setConversations(newConversations);
    setActiveChat(newConversations.length - 1);
    setMessages([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (msgDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  // Load conversations when exhibitor is available
  useEffect(() => {
    if (exhibitor?.email) {
      loadConversations();
    }
  }, [exhibitor]);

  // Load messages when active chat changes
  useEffect(() => {
    if (conversations[activeChat] && exhibitor?.email) {
      loadChatMessages(conversations[activeChat]);
    }
  }, [activeChat]);

  if (!exhibitor) {
    return (
      <div className="message-page">
        <div className="chat-box">
          <div className="welcome-message">
            <p>⚠️ Please login as exhibitor to send messages</p>
            <p>Make sure you have registered as an exhibitor</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-page">
      {/* LEFT SIDE - CHAT LIST */}
      <div className="chat-list">
        <div className="chat-list-header">
          <h2>📬 Booth Messages</h2>
          <button className="new-chat-btn" onClick={createNewConversation}>
            + New
          </button>
        </div>
        
        {conversations.length === 0 ? (
          <div className="welcome-message">
            <p>No conversations yet</p>
            <p>Click "New" to start a conversation with admin!</p>
          </div>
        ) : (
          conversations.map((c, i) => (
            <div
              key={i}
              className={`chat-item ${activeChat === i ? "active" : ""}`}
              onClick={() => setActiveChat(i)}
            >
              <div className="chat-avatar">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="chat-info">
                <h4>{c.name}</h4>
                <p>{c.last}</p>
              </div>
              {c.unread > 0 && <span className="unread-count">{c.unread}</span>}
            </div>
          ))
        )}
      </div>

      {/* RIGHT SIDE - CHAT BOX */}
      <div className="chat-box">
        <div className="chat-header">
          <div>
            <h3>{conversations[activeChat]?.name || "EventSphere Booth Support"}</h3>
            <p className="admin-badge">🏪 Admin Support - Exhibitor Help</p>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>🎪 Welcome to Exhibitor Support!</p>
              <p>Need help with your booth? Send a message to our admin team. We'll respond within 24 hours.</p>
              <p>💡 You can ask about: Booth setup, Visitor analytics, Event schedule, Technical issues</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <motion.div
                key={i}
                className={`bubble ${m.from}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bubble-text">{m.text}</div>
                <div className="bubble-time">{formatTime(m.timestamp)}</div>
              </motion.div>
            ))
          )}
          {loading && (
            <div className="bubble me sending">Sending...</div>
          )}
        </div>

        <div className="input-box">
          <input
            type="text"
            placeholder="Type your message about booth or event..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button onClick={sendMessage} disabled={loading}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}