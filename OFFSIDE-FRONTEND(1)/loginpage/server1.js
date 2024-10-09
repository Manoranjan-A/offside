const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;
const cors = require('cors');

app.use(cors({
    origin: "*"

}))

// Middleware to parse JSON request body
app.use(express.json());

// Serve static files from the 'mainpage' folder
app.use(express.static(path.join(__dirname, 'mainpage')));

// Serve booking.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mainpage', 'booking.html'));
});

// POST endpoint to handle booking data
app.post('/booking', (req, res) => {
    const bookingData = req.body;  // Get the data from the client

    // Extract start and end times from the booking data
    const newStartTime = bookingData.startTime;
    const newEndTime = bookingData.endTime;
    const newDate = bookingData.date;

    // Generate a unique booking ID
    const bookingId = Date.now() + Math.floor(Math.random() * 10000);  // Example: timestamp + random number
    bookingData.bookingId = bookingId;  // Add booking ID to the booking data

    // Read the current bookings from the JSON file (if it exists)
    let bookings = [];
    const filePath = path.join(__dirname, 'booking.json');  // Correct file path to booking.json

    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        bookings = JSON.parse(data);  // Parse existing bookings
    }

    // Check if the new booking time overlaps with any existing booking
    const isTimeConflict = bookings.some(existingBooking => {
        return existingBooking.date === newDate &&
               ((newStartTime >= existingBooking.startTime && newStartTime < existingBooking.endTime) ||
                (newEndTime > existingBooking.startTime && newEndTime <= existingBooking.endTime) ||
                (newStartTime <= existingBooking.startTime && newEndTime >= existingBooking.endTime)); 
    });

    if (isTimeConflict) {
        // Send an error response if the new booking conflicts with existing bookings
        return res.status(409).send({ message: "Booking conflict: The selected time overlaps with an existing booking." });
    }

    // Add the new booking to the array if no conflicts
    bookings.push(bookingData);

    // Write the updated bookings array back to the JSON file
    fs.writeFileSync(filePath, JSON.stringify(bookings, null, 2));  // Save the updated array to booking.json

    // Send the booking ID back to the client as part of the response
    res.status(200).send({ message: "Booking saved successfully", bookingId: bookingId });
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
