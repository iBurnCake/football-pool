document.addEventListener("DOMContentLoaded", () => {
    const username = getCurrentUser();
    if (!username) {
        window.location.href = "index.html"; // Redirect to login if not logged in
    }
    document.getElementById('usernameDisplay').textContent = username;

    // Load games (you would replace this with API fetch for real data)
    const games = [
        { homeTeam: "Texans", homeRecord: "6-2", awayTeam: "Jets", awayRecord: "2-6" },
        { homeTeam: "Saints", homeRecord: "2-6", awayTeam: "Panthers", awayRecord: "1-7" },
        // More games here...
    ];

    displayGames(games);
});

// Function to display games in user's pool
function displayGames(games) {
    const tableBody = document.getElementById('gamesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing rows

    games.forEach((game, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${game.homeTeam} (${game.homeRecord}) vs ${game.awayTeam} (${game.awayRecord})</td>
            <td>
                <button onclick="selectPick(${index}, 'home')">${game.homeTeam}</button>
                <button onclick="selectPick(${index}, 'away')">${game.awayTeam}</button>
            </td>
            <td>
                <input type="number" id="confidence${index}" min="1" max="15" onchange="assignConfidence(${index})" required>
            </td>
        `;
    });
}

// Functions for selecting pick and assigning confidence points
function selectPick(gameIndex, team) {
    userPicks[gameIndex] = { team, points: null };
    alert(`You selected ${team} for game ${gameIndex + 1}`);
}

function assignConfidence(gameIndex) {
    const confidenceInput = document.getElementById(`confidence${gameIndex}`);
    const points = parseInt(confidenceInput.value);

    if (assignedPoints.has(points)) {
        alert("This confidence point is already used. Choose a different one.");
        confidenceInput.value = ''; // Clear duplicate entry
    } else if (points >= 1 && points <= 15) {
        assignedPoints.add(points);
        userPicks[gameIndex].points = points;
        alert(`Assigned ${points} points to game ${gameIndex + 1}`);
    } else {
        alert("Please enter a value between 1 and 15.");
    }
}
