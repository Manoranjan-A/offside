document.addEventListener('DOMContentLoaded', function() {
    const timeSlider = document.getElementById('time-slider');
    const timeRange = document.getElementById('time-range');
    const selectedDate = document.getElementById('selected-date');
    const duration = document.getElementById('duration');
    const totalAmount = document.getElementById('total-amount');

    // Populate today's date
    const today = new Date();
    selectedDate.textContent = today.toDateString();

    // Update time range based on slider
    timeSlider.addEventListener('input', function() {
        const startTime = parseInt(timeSlider.value);
        const endTime = startTime + 1; // Assuming 1-hour slots
        timeRange.textContent = `${formatTime(startTime)} - ${formatTime(endTime)}`;

        // Update duration and total amount
        duration.textContent = 1;
        totalAmount.textContent = 750; // ₹750 for 1 hour
    });

    function formatTime(hour) {
        const suffix = hour >= 12 ? "PM" : "AM";
        const adjustedHour = hour % 12 || 12;
        return `${adjustedHour}:00 ${suffix}`;
    }
});
