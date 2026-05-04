
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// DB
mongoose.connect("YOUR_MONGO_URL");

// Lead Schema
const LeadSchema = new mongoose.Schema({
  name: String,
  phone: String,
  source: { type: String, default: "website" },
  status: { type: String, default: "Lead جديد" },
  budget: String,
  interest: String,
  nextFollowUp: Date,
  createdAt: { type: Date, default: Date.now }
});

const Lead = mongoose.model("Lead", LeadSchema);

// CREATE lead (from website)
app.post("/website-lead", async (req, res) => {
  const lead = new Lead(req.body);
  await lead.save();
  res.json({ ok: true });
});

// GET leads
app.get("/leads", async (req, res) => {
  const leads = await Lead.find().sort({ createdAt: -1 });
  res.json(leads);
});

// UPDATE lead
app.put("/leads/:id", async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(lead);
});

// DELETE lead
app.delete("/leads/:id", async (req, res) => {
  await Lead.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// STATS
app.get("/stats", async (req, res) => {
  const total = await Lead.countDocuments();
  const sold = await Lead.countDocuments({ status: "تم البيع" });
  const newLeads = await Lead.countDocuments({ status: "Lead جديد" });

  res.json({
    total,
    sold,
    newLeads,
    conversion: total ? ((sold / total) * 100).toFixed(2) : 0
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("CRM running"));
