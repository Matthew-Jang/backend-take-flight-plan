const db = require("../models");
const Event = db.event;

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const updated = await Event.update(req.body, {
      where: { event_id: req.params.id },
    });
    if (updated[0] === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.destroy({
      where: { event_id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /events/:id/signup
exports.signupForEvent = async (req, res) => {
  const userId  = req.userId;               // from your auth middleware
  const eventId = parseInt(req.params.id, 10);
  try {
    // Prevent double‐signup
    const [signup, created] = await db.event_signup.findOrCreate({
      where: { user_id: userId, event_id: eventId }
    });
    if (!created) {
      return res.status(400).json({ message: "Already signed up" });
    }
    res.status(201).json(signup);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /events/:id/signups
exports.getEventSignups = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  try {
    const signups = await db.event_signup.findAll({
      where: { event_id: eventId },
      include: [{
        model: db.user,
        attributes: ["id", "fName", "lName", "email"]
      }]
    });
    res.status(200).json(signups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /events/:id/signup   (current user unregister)
exports.unSignupForEvent = async (req, res) => {
  const userId  = req.userId;
  const eventId = parseInt(req.params.id, 10);
  try {
    const deleted = await db.event_signup.destroy({
      where: { user_id: userId, event_id: eventId }
    });
    if (!deleted) {
      return res.status(404).json({ message: "Not currently signed up" });
    }
    res.status(200).json({ message: "Unregistered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /events/signups/me    (list of event IDs)
exports.getMySignups = async (req, res) => {
  const userId = req.userId;
  try {
    const rows = await db.event_signup.findAll({
      where: { user_id: userId },
      attributes: ["event_id"],
    });
    const eventIds = rows.map(r => r.event_id);
    res.status(200).json(eventIds);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /events/:id/signup/:userId   (admin removal)
exports.unSignupForEventAdmin = async (req, res) => {
  const eventId = parseInt(req.params.id, 10);
  const userId  = parseInt(req.params.userId, 10);

  try {
    // delete from the event_signup table
    const num = await db.event_signup.destroy({
      where: { event_id: eventId, user_id: userId }
    });
    if (!num) {
      return res.status(404).json({ message: "Signup not found" });
    }
    res.json({ message: "Removed successfully" });
  } catch (err) {
    console.error("unSignupForEventAdmin error:", err);
    res.status(500).json({ message: err.message });
  }
};