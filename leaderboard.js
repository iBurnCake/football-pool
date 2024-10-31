// Placeholder function for populating leaderboard
document.addEventListener('DOMContentLoaded', () => {
    const leaderboardTable = document.getElementById('leaderboardTable');
    const mockLeaderboardData = [
        { username: "Luke", points: 120 },
        { username: "Angela", points: 115 },
        { username: "Ryan", points: 110 }
    ];
    
    leaderboardTable.innerHTML = mockLeaderboardData
        .map(user => `<tr><td>${user.username}</td><td>${user.points}</td></tr>`)
        .join('');
});
