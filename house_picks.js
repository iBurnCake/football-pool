// Placeholder function for displaying house picks
document.addEventListener('DOMContentLoaded', () => {
    const picksTable = document.getElementById('picksTable');
    const currentDate = new Date();
    const lockDate = new Date('2024-10-31T20:00:00-04:00'); // Lock date in EST

    if (currentDate < lockDate) {
        picksTable.innerHTML = `<p>Picks can still be modified until ${lockDate.toLocaleString()}.</p>`;
    } else {
        picksTable.innerHTML = `<p>Picks are now locked. Here are everyone's final selections:</p>`;
        // Populate locked picks here in future steps
    }
});
