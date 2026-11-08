const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

// ✅ Helper function to generate ticket ID
const generateTicketId = async () => {
  const count = await Ticket.countDocuments();
  const ticketNumber = (count + 1).toString().padStart(4, "0");
  return `#${ticketNumber}`;
};

// ✅ CREATE NEW TICKET
router.post("/create", async (req, res) => {
  try {
    const { user, subject, category, priority, status, description } = req.body;

    console.log("📥 Creating ticket:", req.body);

    // Validation
    if (!user || !subject || !category) {
      return res.status(400).json({
        success: false,
        message: "user, subject, and category are required"
      });
    }

    // Generate ticket ID
    const ticketId = await generateTicketId();

    const ticket = new Ticket({
      ticketId,
      user,
      subject,
      category,
      priority: priority || "Medium",
      status: status || "Open",
      description: description || ""
    });

    await ticket.save();

    console.log("✅ Ticket created:", ticket.ticketId);

    res.status(201).json({
      success: true,
      message: "Ticket created successfully!",
      ticket
    });

  } catch (error) {
    console.error("Create ticket error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ GET ALL TICKETS
router.get("/all", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === "Open").length;
    const pendingTickets = tickets.filter(t => t.status === "Pending").length;
    const closedTickets = tickets.filter(t => t.status === "Closed").length;

    res.json({
      success: true,
      stats: {
        totalTickets,
        openTickets,
        pendingTickets,
        closedTickets
      },
      tickets
    });

  } catch (error) {
    console.error("Get tickets error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ BULK CREATE DEMO TICKETS
router.post("/bulk-create", async (req, res) => {
  try {
    const demoData = [
      { user: "Ali Khan", subject: "Payment Issue", category: "Billing", priority: "High", status: "Open" },
      { user: "Ahmed Raza", subject: "Login Error", category: "Technical", priority: "Medium", status: "Pending" },
      { user: "Sara Ahmed", subject: "Refund Request", category: "Billing", priority: "Low", status: "Closed" },
      { user: "Hassan Ali", subject: "Account Locked", category: "Security", priority: "High", status: "Open" },
      { user: "Areeba Khan", subject: "Profile Update", category: "General", priority: "Low", status: "Pending" },
      { user: "Usman Tariq", subject: "Subscription Error", category: "Billing", priority: "Medium", status: "Closed" },
      { user: "Fatima Zia", subject: "Password Reset", category: "Security", priority: "Medium", status: "Open" },
      { user: "Bilal Shah", subject: "Website Crash", category: "Technical", priority: "High", status: "Open" },
      { user: "Zoya Malik", subject: "Email Verification", category: "General", priority: "Medium", status: "Pending" },
      { user: "Hamza Ali", subject: "Refund Delay", category: "Billing", priority: "Low", status: "Closed" }
    ];

    const tickets = [];
    for (const data of demoData) {
      const ticketId = await generateTicketId();
      const ticket = new Ticket({
        ticketId,
        ...data
      });
      await ticket.save();
      tickets.push(ticket);
    }
    
    res.status(201).json({
      success: true,
      message: `${tickets.length} tickets created successfully!`,
      tickets
    });
  } catch (error) {
    console.error("Bulk create error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ UPDATE TICKET STATUS
router.put("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    
    res.json({
      success: true,
      message: `Ticket status updated to ${status}`,
      ticket
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ DELETE TICKET
router.delete("/delete/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }
    res.json({
      success: true,
      message: "Ticket deleted successfully"
    });
  } catch (error) {
    console.error("Delete ticket error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;