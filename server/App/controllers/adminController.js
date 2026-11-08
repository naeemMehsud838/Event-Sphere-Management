const Event = require('../models/Event');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

// Get Dashboard Data
exports.getDashboardData = async (req, res) => {
    try {
        // Total Events
        const totalEvents = await Event.countDocuments();
        
        // Total Attendees (unique users who bought tickets)
        const totalAttendees = await Ticket.distinct('userId').countDocuments();
        
        // Total Tickets Sold
        const ticketsSold = await Ticket.aggregate([
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);
        
        // Total Revenue
        const revenue = await Ticket.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        
        // Recent Events (last 5)
        const recentEvents = await Event.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title date location status');
        
        // Statistics for charts
        const monthlyRevenue = await Ticket.aggregate([
            {
                $group: {
                    _id: { $month: '$purchaseDate' },
                    total: { $sum: '$totalPrice' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        const monthlyAttendees = await Ticket.aggregate([
            {
                $group: {
                    _id: { $month: '$purchaseDate' },
                    count: { $sum: '$quantity' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json({
            success: true,
            stats: {
                totalEvents,
                totalAttendees,
                totalTicketsSold: ticketsSold[0]?.total || 0,
                totalRevenue: revenue[0]?.total || 0
            },
            recentEvents,
            chartData: {
                monthlyRevenue,
                monthlyAttendees
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create New Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, price, totalSeats } = req.body;
        
        const event = new Event({
            title,
            description,
            date,
            location,
            price,
            totalSeats,
            availableSeats: totalSeats,
            organizer: req.user.id
        });
        
        await event.save();
        
        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create event' });
    }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'name email')
            .sort({ date: -1 });
        
        res.json({
            success: true,
            events
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch events' });
    }
};

// Get All Attendees
exports.getAllAttendees = async (req, res) => {
    try {
        const attendees = await Ticket.find()
            .populate('userId', 'name email')
            .populate('eventId', 'title date')
            .sort({ purchaseDate: -1 });
        
        res.json({
            success: true,
            attendees
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch attendees' });
    }
};

// Get All Tickets
exports.getAllTickets = async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('eventId', 'title')
            .populate('userId', 'name email')
            .sort({ purchaseDate: -1 });
        
        res.json({
            success: true,
            tickets
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
    }
};

// Get All Payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Ticket.find({ status: 'confirmed' })
            .populate('eventId', 'title')
            .populate('userId', 'name email')
            .select('totalPrice purchaseDate quantity status');
        
        const totalRevenue = payments.reduce((sum, p) => sum + p.totalPrice, 0);
        
        res.json({
            success: true,
            payments,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch payments' });
    }
};