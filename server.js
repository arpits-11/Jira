const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({
                email, name, provider: 'google', password: null
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB error:', err.message));

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    provider: { type: String, default: 'email' },
    bio: { type: String, default: '' },
    phone: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    priority: { type: String, default: 'medium' },
    status: { type: String, default: 'todo' },
    customStatus: { type: String, default: '' },
    category: { type: String, default: 'General' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    assignedToName: { type: String, default: '' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', taskSchema);

const columnSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});
const Column = mongoose.model('Column', columnSchema);

const commentSchema = new mongoose.Schema({
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});
const Comment = mongoose.model('Comment', commentSchema);

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    action: { type: String },
    taskTitle: { type: String },
    detail: { type: String },
    createdAt: { type: Date, default: Date.now }
});
const Activity = mongoose.model('Activity', activitySchema);

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    taskTitle: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

const nodemailer = require('nodemailer');

// ─── Email Transporter ────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ─── Helper: Send Email ───────────────────────────────
async function sendTaskEmail(toEmail, assignedByName, taskTitle, taskPriority, taskCategory) {
    try {
        await transporter.sendMail({
            from: `"Jira Clone" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: `📋 New Task Assigned: ${taskTitle}`,
            html: `
                <div style="font-family:system-ui; max-width:500px; margin:auto; padding:24px; border:1px solid #eee; border-radius:12px;">
                    <h2 style="color:#253858;">You have a new task! 🎯</h2>
                    <p style="color:#5e6c84;">Hi there,</p>
                    <p style="color:#5e6c84;"><strong>${assignedByName}</strong> has assigned you a task on Jira Clone.</p>
                    
                    <div style="background:#f4f5f7; border-radius:8px; padding:16px; margin:16px 0;">
                        <p style="margin:4px 0;"><strong>Task:</strong> ${taskTitle}</p>
                        <p style="margin:4px 0;"><strong>Priority:</strong> ${taskPriority}</p>
                        <p style="margin:4px 0;"><strong>Category:</strong> ${taskCategory || 'General'}</p>
                    </div>

                    <p style="color:#5e6c84;">Please log in to view and manage your task.</p>
                    <a href="http://127.0.0.1:5500/index.html" 
                        style="display:inline-block; padding:10px 24px; background:dodgerblue; color:white; border-radius:6px; text-decoration:none; font-weight:600;">
                        Open Jira Clone
                    </a>
                    <p style="color:#c1c7d0; font-size:12px; margin-top:24px;">This is an automated message from Jira Clone.</p>
                </div>
            `
        });
        console.log(`Email sent to ${toEmail}`);
    } catch (err) {
        console.log('Email error:', err.message);
    }
}

async function logActivity(userId, userName, action, taskTitle, detail = '') {
    try {
        const activity = new Activity({ userId, userName, action, taskTitle, detail });
        await activity.save();
    }
    catch (err) {
        console.log('Activity log error', err.message);
    }
}

function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// ─── Route 1: Email Signup (landing page form) ────────
app.post('/api/signup', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already registered' });
        const user = new User({ email, provider: 'email' });
        await user.save();
        res.status(201).json({ message: 'Signup successful!', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ─── Route 2: Google/Microsoft OAuth ─────────────────
app.post('/api/oauth-login', async (req, res) => {
    const { email, name, provider } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email, name, provider });
            await user.save();
        }
        res.status(200).json({ message: 'Login successful!', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ─── Route 3: Register ────────────────────────────────
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const existing = await User.findOne({ email });
        if (existing && existing.provider !== 'invited') {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, provider: 'email' });
        await user.save();
        res.status(201).json({ message: 'Registration successful!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// ─── Route 4: Login ───────────────────────────────────
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found' });
        if (!user.password) {
            return res.status(401).json({ message: 'Please register first to set your password' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Wrong password' });
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ message: 'Login successful!', token, user: { name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.get('/api/tasks', authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            $or: [
                { userId: req.userId },
                { assignedTo: req.userId }
            ]
        }).sort({ createdAt: -1 });
        res.json(tasks);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
    const { title, priority, category, assignedTo, assignedToName, assignedToEmail } = req.body;
    try {
        const task = new Task({
            title, priority, category, assignedTo: assignedTo || null, assignedToName: assignedToName || '', userId: req.userId
        });
        await task.save();

        const user = await User.findById(req.userId);
        const userName = user.name || user.email;

        await logActivity(req.userId, userName, 'created', title, `Priority: ${priority}`);

        if (assignedTo && assignedTo !== req.userId.toString()) {
            const notification = new Notification({
                userId: assignedTo,
                message: `${userName} assigned you a task`,
                taskId: task._id,
                taskTitle: title
            });
            await notification.save();

            if (assignedToEmail) {
                await sendTaskEmail(assignedToEmail, userName, title, priority, category);
            }
        }
        res.status(201).json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.put('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const oldTask = await Task.findById(req.params.id);
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });

        const user = await User.findById(req.userId);
        const userName = user.name || user.email;

        if (req.body.status && oldTask.status !== req.body.status) {
            await logActivity(req.userId, userName, 'moved', task.title,
                `${oldTask.status} → ${req.body.status}`);
        }
        if (req.body.title || req.body.priority || req.body.category) {
            await logActivity(req.userId, userName, 'updated', task.title, 'Task details edited');
        }
        if (req.body.assignedTo && req.body.assignedTo !== oldTask.assignedTo?.toString()) {
            await logActivity(req.userId, userName, 'assigned', task.title,
                `Assigned to ${req.body.assignedToName}`);

            if (req.body.assignedTo !== req.userId.toString()) {
                const notification = new Notification({
                    userId: req.body.assignedTo,
                    message: `${userName} assigned you a task`,
                    taskId: task._id,
                    taskTitle: task.title
                });
                await notification.save();
            }
        }
        res.json(task);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

app.delete('/api/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const user = await User.findById(req.userId);
        const userName = user.name || user.email;

        await Task.findByIdAndDelete(req.params.id);
        await logActivity(req.userId, userName, 'deleted', task.title, '');

        res.json({ message: 'Task deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/activity', authMiddleware, async (req, res) => {
    try {
        const activities = await Activity.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(activities);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.put('/api/notifications/read', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.userId }, { read: true });
        res.json({ message: 'All marked as read' })
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    };
});

app.put('/api/profile', authMiddleware, async (req, res) => {
    try {
        const { name, bio, phone } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, bio, phone },
            { returnDocument: 'after' }
        ).select('-password');
        res.json({ message: 'Profile updated!', user });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    };
});

app.get('/api/comments/:taskId', authMiddleware, async (req, res) => {
    try {
        const comments = await Comment.find({ taskId: req.params.taskId })
            .sort({ createdAt: 1 });
        res.json(comments);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/comments/:taskId', authMiddleware, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });

        const user = await User.findById(req.userId);

        const comment = new Comment({
            taskId: req.params.taskId,
            userId: req.userId,
            userName: user.name || user.email, text
        });
        await comment.save();
        res.status(201).json(comment);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/comments/:commentId', authMiddleware, async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.json({ message: 'Comment deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}).select('name email');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error ' });
    }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    async (req, res) => {
        const token = jwt.sign(
            { userId: req.user._id, email: req.user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const name = req.user.name;
        const email = req.user.email;

        res.redirect(`http://127.0.0.1:5500/index.html?token=${token}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`);
    }
)

app.get('/api/columns', authMiddleware, async (req, res) => {
    try {
        const columns = await Column.find({ userId: req.userId }).sort({ createdAt: 1 });
        res.json(columns);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/columns', authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ message: 'Column name required' });
        const existing = await Column.findOne({ name, userId: req.userId });
        if (existing) return res.status(409).json({ message: 'Column already exists' });
        const column = new Column({ name, userId: req.userId });
        await column.save();
        res.status(201).json(column);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.delete('/api/columns/:id', authMiddleware, async (req, res) => {
    try {
        await Column.findByIdAndDelete(req.params.id);
        await Task.updateMany(
            { customStatus: req.params.id, userId: req.userId },
            { status: 'todo', customStatus: '' }
        );
        res.json({ message: 'Column deleted' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── Route: Invite user by email ──────────────────────
app.post('/api/invite-user', authMiddleware, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(200).json({
                message: 'User already exists',
                user: { _id: existing._id, name: existing.name, email: existing.email }
            });
        }

        // Create a placeholder user with just email
        const newUser = new User({
            email,
            name: email.split('@')[0], // use email prefix as name
            provider: 'invited',
            password: null
        });
        await newUser.save();

        res.status(201).json({
            message: 'User invited successfully!',
            user: { _id: newUser._id, name: newUser.name, email: newUser.email }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


const cron = require('node-cron');
// ─── AI Helper: Call Claude API ───────────────────────
async function callClaude(prompt, maxTokens = 1024) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: maxTokens,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await response.json();
    if (!data.content) throw new Error(JSON.stringify(data));
    return data.content[0].text;
}

// ─── AI Route 1: Natural Language Task Creator ────────
app.post('/api/ai/parse-task', authMiddleware, async (req, res) => {
    try {
        const { sentence } = req.body;
        if (!sentence) return res.status(400).json({ message: 'Sentence is required' });

        // Get all users so AI can match names
        const users = await User.find({}).select('name email');
        const userList = users.map(u => `${u.name || u.email} (id: ${u._id})`).join(', ');

        const prompt = `You are a project management assistant. Parse the following natural language sentence into a structured task.
 
Sentence: "${sentence}"
 
Available team members: ${userList || 'None'}
 
Reply ONLY with a valid JSON object, no explanation, no markdown, no backticks:
{
  "title": "task title here",
  "priority": "high" or "medium" or "low",
  "category": "General" or "Design" or "Development" or "Marketing",
  "assignedToName": "exact name from team members list or empty string if not mentioned",
  "assignedToId": "user id from team members list or empty string if not mentioned"
}`;

        const result = await callClaude(prompt);
        const cleaned = result.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        res.json(parsed);
    } catch (err) {
        res.status(500).json({ message: 'AI error', error: err.message });
    }
});

// ─── AI Route 2: Sprint Planner ───────────────────────
app.post('/api/ai/sprint-plan', authMiddleware, async (req, res) => {
    try {
        const { developers, sprintDays } = req.body;
        if (!developers || !sprintDays) return res.status(400).json({ message: 'Developers and sprint days required' });

        const tasks = await Task.find({ userId: req.userId, status: 'todo' });
        if (!tasks.length) return res.json({ plan: 'No TODO tasks found to plan a sprint.' });

        const taskList = tasks.map((t, i) =>
            `${i + 1}. "${t.title}" | Priority: ${t.priority} | Category: ${t.category || 'General'} | Assigned: ${t.assignedToName || 'Unassigned'}`
        ).join('\n');

        const prompt = `You are an expert scrum master. Plan a sprint for a team.
 
Team size: ${developers} developers
Sprint duration: ${sprintDays} working days
Assumption: each developer handles ~${Math.round((sprintDays * 6) / developers)} hours of work per sprint
 
TODO Tasks:
${taskList}
 
Create a sprint plan with:
1. 🎯 Sprint Goal — one sentence summary of what this sprint achieves
2. ✅ Recommended Sprint Backlog — which tasks to include (pick realistic amount based on team size and days), assign each to a developer if already assigned, otherwise suggest who should take it
3. 📊 Workload Distribution — how work is spread across developers
4. ⚠️ Risks — any concerns about the sprint
5. 🚫 Backlog (Deferred) — tasks not included and why
 
Be specific, practical, and concise. Use bullet points.`;

        const plan = await callClaude(prompt, 2048);
        res.json({ plan: plan.trim() });
    } catch (err) {
        res.status(500).json({ message: 'AI error', error: err.message });
    }
});

// ─── AI Route 3: Weekly Summary Email ─────────────────
async function sendWeeklySummary() {
    try {
        const users = await User.find({ provider: { $ne: 'invited' } });

        for (const user of users) {
            const tasks = await Task.find({
                $or: [{ userId: user._id }, { assignedTo: user._id }]
            });

            if (!tasks.length) continue;

            const taskSummary = tasks.map(t =>
                `- "${t.title}" | Status: ${t.status} | Priority: ${t.priority} | Category: ${t.category || 'General'}`
            ).join('\n');

            const prompt = `You are a productivity assistant. Write a friendly, motivating weekly summary email for ${user.name || user.email}.
 
Their current tasks:
${taskSummary}
 
Write an email with:
1. A warm greeting using their name
2. What they completed last week (done tasks)
3. What's on their plate this week (todo + inprogress tasks)  
4. Their workload score (light/moderate/heavy based on task count)
5. One motivating closing line
 
Keep it concise, friendly, professional. No subject line needed, just the email body.`;

            const emailBody = await callClaude(prompt, 1024);

            await transporter.sendMail({
                from: `"Jira Clone" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: `📊 Your Weekly Task Summary — ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
                html: `
                    <div style="font-family:system-ui; max-width:560px; margin:auto; padding:24px; border:1px solid #eee; border-radius:12px;">
                        <div style="background:dodgerblue; padding:16px 24px; border-radius:8px; margin-bottom:24px;">
                            <h2 style="color:white; margin:0; font-size:1.2rem;">📊 Weekly Summary</h2>
                            <p style="color:rgba(255,255,255,0.85); margin:4px 0 0; font-size:13px;">
                                Week of ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div style="white-space:pre-wrap; color:#253858; font-size:14px; line-height:1.8;">${emailBody}</div>
                        <hr style="border:none; border-top:1px solid #eee; margin:24px 0;">
                        <p style="color:#c1c7d0; font-size:12px; text-align:center;">Jira Clone — Automated Weekly Summary</p>
                    </div>
                `
            });
            console.log(`Weekly summary sent to ${user.email}`);
        }
    } catch (err) {
        console.log('Weekly summary error:', err.message);
    }
}

// Run every Monday at 8:00 AM
cron.schedule('0 8 * * 1', sendWeeklySummary, { timezone: 'Asia/Kolkata' });

// Manual trigger endpoint (for testing)
app.post('/api/ai/send-weekly-summary', authMiddleware, async (req, res) => {
    try {
        await sendWeeklySummary();
        res.json({ message: 'Weekly summary emails sent!' });
    } catch (err) {
        res.status(500).json({ message: 'Error sending summaries', error: err.message });
    }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));