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

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
});

const Employee = mongoose.model('Employee', employeeSchema);

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

// List all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Check if email already exists
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Employee with this email already exists' });
    }
    const employee = new Employee({ name, email, password, role });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 