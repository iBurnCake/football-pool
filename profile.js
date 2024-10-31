// Display a placeholder message for now
document.addEventListener('DOMContentLoaded', () => {
    const username = sessionStorage.getItem("loggedInUser") || "Guest";
    document.getElementById('profileSection').innerHTML = `<h2>Welcome, ${username}</h2><p>Your profile data will be displayed here.</p>`;
});
