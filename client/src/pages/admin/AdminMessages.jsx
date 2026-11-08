import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "./AdminMessages.css";

export default function AdminMessages() {
  const [userMessages, setUserMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setAdmin(storedUser);
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const response = await axios.get(
        "http://localhost:1000/api/messages/admin/all",
        config
      );

      if (response.data.success) {
        const groupedMessages = {};
        response.data.messages.forEach((msg) => {
          const userEmail = msg.email === "admin@eventsphere.com" ? msg.recipientEmail : msg.email;
          if (!groupedMessages[userEmail] && userEmail !== "admin@eventsphere.com") {
            groupedMessages[userEmail] = {
              email: userEmail,
              name: msg.name,
              messages: [],
              unread: 0,
            };
          }
          if (userEmail !== "admin@eventsphere.com") {
            groupedMessages[userEmail].messages.push(msg);
            if (!msg.isRead && msg.recipientEmail === "admin@eventsphere.com") {
              groupedMessages[userEmail].unread++;
            }
          }
        });
        
        const userList = Object.values(groupedMessages);
        userList.forEach((user) => {
          user.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          user.lastMessage = user.messages[user.messages.length - 1]?.message?.substring(0, 40);
          user.lastDate = user.messages[user.messages.length - 1]?.createdAt;
        });
        userList.sort((a, b) => new Date(b.lastDate) - new Date(a.lastDate));
        
        setUserMessages(userList);
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error("Failed to load messages");
    }
  };

  const loadMessages = async (selectedUserData) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const email = selectedUserData.email;
      console.log("🔍 Fetching messages for email:", email);

      const response = await axios.get(
        `http://localhost:1000/api/messages/user/${email}`,
        config
      );

      if (response.data.success && response.data.messages) {
        const allMessages = [];
        
        response.data.messages.forEach((msg) => {
          if (msg.email === email && msg.direction === "outgoing") {
            // User message
            allMessages.push({
              from: "them",
              text: msg.message,
              timestamp: msg.createdAt,
              _id: msg._id,
            });
          } else if (msg.email === "admin@eventsphere.com" && msg.recipientEmail === email) {
            // Admin reply
            allMessages.push({
              from: "me",
              text: msg.message,
              timestamp: msg.createdAt,
              _id: msg._id,
            });
          }
        });
        
        allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        console.log("✅ Formatted messages:", allMessages.length);
        setMessages(allMessages);
        
        for (const msg of response.data.messages) {
          if (!msg.isRead && msg.recipientEmail === "admin@eventsphere.com") {
            await markAsRead(msg._id);
          }
        }
      }
    } catch (error) {
      console.error("Load messages error:", error);
      setMessages([]);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:1000/api/messages/admin/read/${messageId}`, {}, config);
    } catch (error) {
      console.error("Mark read error:", error);
    }
  };

  const sendReply = async () => {
    if (!input.trim()) return;
    if (!selectedUser) {
      toast.error("Please select a user to reply");
      return;
    }

    setLoading(true);
    const replyText = input.trim();

    try {
      const token = localStorage.getItem("token");
      const config = { 
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        } 
      };

      const latestMessage = selectedUser.messages[selectedUser.messages.length - 1];

      const response = await axios.post(
        `http://localhost:1000/api/messages/admin/reply/${latestMessage._id}`,
        { replyMessage: replyText },
        config
      );

      if (response.data.success) {
        // Add reply to UI immediately
        const newMessage = { 
          from: "me", 
          text: replyText, 
          timestamp: new Date().toISOString(),
          _id: Date.now(),
        };
        
        setMessages([...messages, newMessage]);
        setInput("");
        toast.success("Reply sent!");
        
        setTimeout(() => {
          fetchUsers();
          loadMessages(selectedUser);
        }, 500);
      } else {
        toast.error(response.data.message || "Failed to send reply");
      }
    } catch (error) {
      console.error("Send reply error:", error);
      toast.error(error.response?.data?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = async (user) => {
    setSelectedUser(user);
    await loadMessages(user);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  useEffect(() => {
    if (admin) {
      fetchUsers();
      const interval = setInterval(fetchUsers, 30000);
      return () => clearInterval(interval);
    }
  }, [admin]);

  if (!admin) {
    return (
      <div className="message-page">
        <div className="chat-box">
          <div className="welcome-message">
            <p>Please login to view messages</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="message-page">
      <div className="chat-list">
        <h2>Messages 💬</h2>
        {userMessages.length === 0 ? (
          <div className="welcome-message">
            <p>No messages yet</p>
          </div>
        ) : (
          userMessages.map((c, idx) => (
            <div
              key={idx}
              className={`chat-item ${selectedUser?.email === c.email ? "active" : ""}`}
              onClick={() => handleSelectUser(c)}
            >
              <h4>{c.name}</h4>
              <p>{c.lastMessage}...</p>
              {c.unread > 0 && <span className="unread-count">{c.unread}</span>}
            </div>
          ))
        )}
      </div>

      <div className="chat-box">
        <div className="chat-header">
          <h3>{selectedUser ? selectedUser.name : "Admin Inbox"}</h3>
          {selectedUser && <p className="admin-badge">📧 {selectedUser.email}</p>}
        </div>

        <div className="messages">
          {!selectedUser ? (
            <div className="welcome-message">
              <p>👋 Welcome to Admin Inbox!</p>
              <p>Select a conversation to view messages.</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="welcome-message">
              <p>✨ No messages yet</p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <motion.div
                key={m._id || idx}
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

        {selectedUser && (
          <div className="input-box">
            <input
              type="text"
              placeholder="Type your reply..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  sendReply();
                }
              }}
              disabled={loading}
            />
            <button onClick={sendReply} disabled={loading}>
              <Send size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}