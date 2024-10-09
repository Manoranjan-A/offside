const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Required to handle file system operations

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin:"*"
}));

// Serve static files from 'mainpage' directory
app.use(express.static(path.join(__dirname, 'mainpage')));

// Serve index2.html when visiting '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mainpage', 'index2.html'));
});

// Route to get feedbacks from feedback.json
app.get('/feedbacks', (req, res) => {
    fs.readFile(path.join(__dirname, 'feedback.json'), 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ message: 'Error reading feedbacks' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Route to submit feedback
app.post('/feedback', (req, res) => {
    const { username, feedback } = req.body;
    
    if (username && feedback) {
        // Read existing feedbacks from feedback.json
        fs.readFile(path.join(__dirname, 'feedback.json'), 'utf-8', (err, data) => {
            if (err) {
                res.status(500).json({ message: 'Error reading feedback file' });
                return;
            }

            let feedbacks = JSON.parse(data);

            // Add the new feedback
            feedbacks.push({ username, feedback });

            // Write the updated feedbacks back to feedback.json
            fs.writeFile(path.join(__dirname, 'feedback.json'), JSON.stringify(feedbacks, null, 2), (err) => {
                if (err) {
                    res.status(500).json({ message: 'Error saving feedback' });
                } else {
                    res.status(200).json({ message: 'Feedback submitted successfully' });
                }
            });
        });
    } else {
        res.status(400).json({ message: 'Username and feedback are required' });
    }
});

app.get('/booking/:id', (req, res) => {
    const bookingId = req.params.id;
    console.log('Received request for booking ID:', bookingId); // Log request

    // Read the booking.json file
    fs.readFile('booking.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading booking.json:', err);
            return res.status(500).json({ message: 'Error reading booking data' });
        }

        // Parse the JSON data
        const bookings = JSON.parse(data);
        console.log('Loaded bookings:', bookings); // Log bookings

        // Find the booking with the matching bookingId
        const booking = bookings.find(b => b.bookingId.toString() === bookingId);
        if (booking) {
            console.log('Found booking:', booking); // Log booking found
            res.json(booking);
        } else {
            console.log('Booking not found for ID:', bookingId); // Log not found
            res.status(404).json({ message: 'Booking not found' });
        }
    });
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
