import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "./attendeeMessage.css";

export default function AttendeeMessage() {
  const [activeChat, setActiveChat] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);

  // Get logged in user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    console.log("🔐 Stored user:", storedUser);
    setUser(storedUser);
  }, []);

  // Load all conversations
  const loadConversations = async () => {
    if (!user?.email) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      console.log("📡 Fetching messages for:", user.email);

      const response = await axios.get(
        `http://localhost:1000/api/messages/user/${user.email}`,
        config
      );

      console.log("📨 Response:", response.data);

      if (response.data.success && response.data.messages) {
        const userMessages = response.data.messages;
        
        if (userMessages.length === 0) {
          setConversations([]);
          setMessages([]);
          return;
        }

        // Group messages by subject
        const grouped = {};
        userMessages.forEach(msg => {
          const subject = msg.subject || "Support";
          if (!grouped[subject]) {
            grouped[subject] = {
              name: subject,
              messages: [],
              unread: 0,
              lastDate: msg.createdAt
            };
          }
          grouped[subject].messages.push(msg);
          if (msg.status === "unread" && msg.email === user.email) {
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
      toast.error("Failed to load messages");
      setConversations([]);
    }
  };

  // Load messages for selected chat
  const loadChatMessages = async (chat) => {
    if (!chat || !user?.email) return;
    
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(
        `http://localhost:1000/api/messages/user/${user.email}`,
        config
      );

      if (response.data.success && response.data.messages) {
        const chatMessages = response.data.messages.filter(msg => 
          (msg.subject || "Support") === chat.name
        );
        
        const allMessages = [];
        
        chatMessages.forEach(msg => {
          // Message from user (attendee)
          if (msg.email === user.email && msg.message) {
            allMessages.push({
              from: "me",
              text: msg.message,
              timestamp: msg.createdAt
            });
          }
          
          // Reply from admin
          if (msg.email !== user.email && msg.message) {
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

  // Send message to admin
  const sendMessage = async () => {
    if (!input.trim()) return;
    if (!user?.email) {
      toast.error("Please login to send message");
      return;
    }

    setLoading(true);
    const messageText = input.trim();
    const currentSubject = conversations[activeChat]?.name || "Support";

    try {
      const token = localStorage.getItem("token");
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        } 
      };

      const response = await axios.post(
        "http://localhost:1000/api/messages/send",
        {
          message: messageText,
          subject: currentSubject
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
        toast.success("Message sent!");
        
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
    const newName = `Support ${conversations.length + 1}`;
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

  // Load conversations when user is available
  useEffect(() => {
    if (user?.email) {
      loadConversations();
    }
  }, [user]);

  // Load messages when active chat changes
  useEffect(() => {
    if (conversations[activeChat] && user?.email) {
      loadChatMessages(conversations[activeChat]);
    }
  }, [activeChat]);

  if (!user) {
    return (
      <div className="message-page">
        <div className="chat-box">
          <div className="welcome-message">
            <p>Please login to send messages</p>
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
          <h2>Messages 💬</h2>
          <button className="new-chat-btn" onClick={createNewConversation}>
            + New
          </button>
        </div>
        
        {conversations.length === 0 ? (
          <div className="welcome-message">
            <p>No conversations yet</p>
            <p>Click "New" to start a conversation!</p>
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
            <h3>{conversations[activeChat]?.name || "EventSphere Support"}</h3>
            <p className="admin-badge">👑 Admin Support</p>
          </div>
        </div>

        <div className="messages">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <p>👋 Welcome to EventSphere Support!</p>
              <p>Send a message to our admin team. We'll respond within 24 hours.</p>
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
            placeholder="Type your message..."
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