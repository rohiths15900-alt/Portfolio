require("dotenv").config();
const { buildEmailHtml, SUBJECT_EMOJI } = require("./emailTemplate");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();

/* ---------------------------------------------------------------
   1. MIDDLEWARE  (code that runs on every request before your routes)
---------------------------------------------------------------- */
app.use(express.json({ limit: "10kb" })); // lets us read JSON sent by React
app.use(cors({ origin: process.env.CLIENT_URL })); // only YOUR website may call this API

/* ---------------------------------------------------------------
   2. DATABASE MODELS  (the "shape" of what we save in MongoDB)
---------------------------------------------------------------- */
const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      name: String,
      email: String,
      subject: String,
      message: String,
    },
    { timestamps: true } // adds createdAt automatically
  )
);

const Counter = mongoose.model(
  "Counter",
  new mongoose.Schema({
    key: { type: String, unique: true },
    count: { type: Number, default: 0 },
  })
);

/* ---------------------------------------------------------------
   3. EMAIL SETUP  (sends you a notification when someone writes)
---------------------------------------------------------------- */



const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail "App Password", NOT your normal password
  },
});


/* ---------------------------------------------------------------
   4. ROUTES  (the URLs your React app talks to)
---------------------------------------------------------------- */

// Health check - open http://localhost:5000/ to confirm the server is alive
app.get("/", (req, res) => res.send("Backend is running ✅"));

// Stop spammers: max 5 messages per IP every 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many messages. Please try again later." },
});

const ALLOWED_SUBJECTS = [
  "Job Opportunity",
  "Project / Freelance",
  "Collaboration",
  "Just saying hi",
];


// Makes visitor text safe to put inside HTML (stops people injecting code)

const sendNotification = async ({ replyTo, subject, text, html }) => {
  // On Render: use Resend (HTTPS, not blocked)
  if (process.env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [process.env.EMAIL_TO],
        reply_to: replyTo,
        subject,
        text,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return;
  }

  // On your computer: keep using Gmail
  await sendNotification({
  replyTo: email,
  subject: `${SUBJECT_EMOJI[subject] || "✉️"} [Portfolio] ${subject} - ${name}`,
  text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
  html: buildEmailHtml({ name, email, subject, message }),
});
};

// ---- POST /api/contact : receive the form ----
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, website } = req.body;

    // "website" is a hidden trap field. Humans never fill it, bots do.
    if (website) return res.json({ ok: true });

    // Validate (never trust data coming from the browser)
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
    if (
      !name || name.trim().length < 2 || name.length > 80 ||
      !emailOk ||
      !ALLOWED_SUBJECTS.includes(subject) ||
      !message || message.trim().length < 5 || message.length > 500
    ) {
      return res.status(400).json({ error: "Please check your details and try again." });
    }

    // 1) Save to database first so nothing is lost
    await Message.create({
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
    });

    // 2) Email yourself (if this fails, the message is still saved)
    try {
               await transporter.sendMail({
     from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
     to: process.env.EMAIL_TO || process.env.EMAIL_USER,
     replyTo: email,
     subject: `${SUBJECT_EMOJI[subject] || "✉️"} [Portfolio] ${subject} - ${name}`,
     text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
     html: buildEmailHtml({ name, email, subject, message }),
   });
    } catch (mailErr) {
      console.error("Email failed (message was still saved):", mailErr.message);
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// ---- GET /api/visitors : just read the number ----
app.get("/api/visitors", async (req, res) => {
  try {
    const doc = await Counter.findOne({ key: "site" });
    res.json({ count: doc ? doc.count : 0 });
  } catch (err) {
    res.status(500).json({ error: "Could not read visitors" });
  }
});

// ---- POST /api/visitors/hit : add +1 (frontend calls this once per browser) ----
app.post("/api/visitors/hit", async (req, res) => {
  try {
    const doc = await Counter.findOneAndUpdate(
      { key: "site" },
      { $inc: { count: 1 } },
      { upsert: true, new: true } // create it if it doesn't exist yet
    );
    res.json({ count: doc.count });
  } catch (err) {
    res.status(500).json({ error: "Could not update visitors" });
  }
});

/* ---------------------------------------------------------------
   5. START: connect to the database, then start listening
---------------------------------------------------------------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });