const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const fs = require('fs');
const cors = require('cors');
const session = require('express-session');
const path = require('path'); // Importing path module for serving static files

const app = express();
const PORT = 5002;

// Middleware setup
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));

// Load the users from the JSON file
const loadUsers = () => {
    if (fs.existsSync('users.json')) {
        const data = fs.readFileSync('users.json');
        return JSON.parse(data);
    }
    return [];
};

// Save users back to the JSON file
const saveUsers = (users) => {
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
};

// Function to validate email and phone number
const isValidEmailOrPhone = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/; // Regex for a 10-digit phone number
    return emailRegex.test(input) || phoneRegex.test(input);
};

// Login Route
app.post('/login', async (req, res) => {
    const { input, password } = req.body; // Change email to input

    // Validate email or phone number
    if (!isValidEmailOrPhone(input)) {
        return res.status(400).json({ error: 'Invalid email or phone number format' });
    }

    // Load users
    const users = loadUsers();

    // Find the user by email or phone number
    const user = users.find(user => user.email === input || user.phone === input); // Assuming phone number is stored in the user object
    if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../turf-booking-frontend/loginpage')));

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, input, password } = req.body; // Change email to input

    // Validate email or phone number
    if (!isValidEmailOrPhone(input)) {
        return res.status(400).json({ error: 'Invalid email or phone number format' });
    }

    // Load users
    const users = loadUsers();

    // Check if the user already exists
    const existingUser = users.find(user => user.email === input || user.phone === input); // Assuming phone number is stored in the user object
    if (existingUser) {
        return res.status(400).json({ error: 'Email or phone number already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add new user to the users array
    users.push({ username, email: input.includes('@') ? input : null, phone: input.includes('@') ? null : input, password: hashedPassword });

    // Save the updated users array back to the file
    saveUsers(users);

    res.status(201).json({ message: 'User registered successfully' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
