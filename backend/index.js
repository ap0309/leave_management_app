const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/leave_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Leave Application Schema
const leaveSchema = new mongoose.Schema({
  employeeName: String,
  employeeEmail: String,
  leaveType: String,
  fromDate: String,
  toDate: String,
  reason: String,
  status: { type: String, default: 'Pending' },
  appliedDate: { type: Date, default: Date.now },
});

const LeaveApplication = mongoose.model('LeaveApplication', leaveSchema);

// Routes
app.get('/api/leaves', async (req, res) => {
  const leaves = await LeaveApplication.find();
  res.json(leaves);
});

app.post('/api/leaves', async (req, res) => {
  const leave = new LeaveApplication(req.body);
  await leave.save();
  res.status(201).json(leave);
});

app.put('/api/leaves/:id', async (req, res) => {
  const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(leave);
});

app.delete('/api/leaves/:id', async (req, res) => {
  await LeaveApplication.findByIdAndDelete(req.params.id);
  res.json({ message: 'Leave application deleted' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 