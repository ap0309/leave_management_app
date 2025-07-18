const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/leave_management';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Ensure default admin exists
const ensureDefaultAdmin = async () => {
  const admin = await Employee.findOne({ role: 'admin' });
  if (!admin) {
    await Employee.create({
      name: 'Admin',
      email: 'admin@brainybeam.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Default admin created: admin@brainybeam.com / admin123');
  }
};

db.once('open', async () => {
  console.log('Connected to MongoDB');
  await ensureDefaultAdmin();
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
  leaveBalances: {
    sick: { type: Number, default: 5 },
    casual: { type: Number, default: 5 },
    annual: { type: Number, default: 7 },
    maternity: { type: Number, default: 0 },
    paternity: { type: Number, default: 0 },
    emergency: { type: Number, default: 2 },
  },
  leaveHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LeaveApplication' }],
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

  // If status is being set to Approved and was not already Approved, update employee leave balance and history
  if (leave && req.body.status === 'Approved') {
    const employee = await Employee.findOne({ email: leave.employeeEmail });
    if (employee) {
      // Only update if this leave is not already in history (prevents double decrement)
      const alreadyInHistory = employee.leaveHistory.some(
        id => id.toString() === leave._id.toString()
      );
      if (!alreadyInHistory) {
        // Decrement leave balance for the leave type
        const leaveType = leave.leaveType.toLowerCase();
        const days = leave.numberOfDays || 1;
        if (employee.leaveBalances[leaveType] !== undefined) {
          employee.leaveBalances[leaveType] = Math.max(0, employee.leaveBalances[leaveType] - days);
        }
        // Add to leave history
        employee.leaveHistory.push(leave._id);
        await employee.save();
      }
    }
  }

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

// Login endpoint for employees and admins
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const user = await Employee.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({
    email: user.email,
    role: user.role,
    name: user.name
  });
});

// Endpoint to get leave balance for an employee by email
app.get('/api/employees/:email/leave-balance', async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.params.email });
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee.leaveBalances);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
});

// Endpoint to update leave balance for an employee by email
app.put('/api/employees/:email/leave-balance', async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      { email: req.params.email },
      { leaveBalances: req.body },
      { new: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee.leaveBalances);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update leave balance' });
  }
});

// Endpoint to get leave history for an employee by email
app.get('/api/employees/:email/leave-history', async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.params.email }).populate('leaveHistory');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee.leaveHistory);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leave history' });
  }
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 