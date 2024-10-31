document.addEventListener("DOMContentLoaded", () => {
    const leaderboardTable = document.getElementById("leaderboardTable");

    // Example data - for actual use, calculate scores based on results
    const leaderboard = [
        { username: "LukeRomano", totalPoints: 120 },
        { username: "AngelaKant", totalPoints: 120 },
        { username: "RyanSanders", totalPoints: 120 },
        { username: "CharlesKeegan", totalPoints: 120 },
        { username: "WilliamMathis", totalPoints: 120 },
    ];

    displayLeaderboard(leaderboard);
});

function displayLeaderboard(leaderboard) {
    const tableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing rows

    leaderboard.forEach(user => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.totalPoints}</td>
        `;
    });
}
