// User profiles (username and password)
const userProfiles = {
    "AngelaKant": "5353",
    "LukeRomano": "4242",
    "RyanSanders": "8989",
    "CharlesKeegan": "0000",
    "WilliamMathis": "2222" // New user added
};

// Initialize variables
let userPicks = {}; // Store each user's picks for the games
let assignedPoints = new Set(); // Track used confidence points
let games = []; // Hold game details fetched from API
let leaderboard = { "AngelaKant": 120, "LukeRomano": 120, "RyanSanders": 120, "CharlesKeegan": 120, "WilliamMathis": 120 }; // Starting points

// Function to fetch game data from the API
async function fetchGameData() {
    try {
        const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events', {
            headers: { 'x-api-key': 'cf87518a-2988-4c7b-8ac9-4443bb' }
        });

        if (!response.ok) throw new Error("Failed to fetch game events");

        const data = await response.json();
        games = data.items.map(item => ({
            homeTeam: item.competitions[0].competitors[0].team.displayName,
            awayTeam: item.competitions[0].competitors[1].team.displayName,
            homeRecord: item.competitions[0].competitors[0].record,
            awayRecord: item.competitions[0].competitors[1].record,
            gameId: item.id,
            status: item.status.type.shortDetail
        }));

        displayGames(games); // Display fetched games
    } catch (error) {
        console.error("Error fetching NFL data:", error);
    }
}

// Function to display games in the table with options for picking teams
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
                <input type="number" id="confidence${index}" min="1" max="16" onchange="assignConfidence(${index})" required>
            </td>
        `;
    });
}

// Functions for managing picks and confidence points
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
    } else if (points >= 1 && points <= 16) {
        assignedPoints.add(points);
        userPicks[gameIndex].points = points;
        alert(`Assigned ${points} points to game ${gameIndex + 1}`);
    } else {
        alert("Please enter a value between 1 and 16.");
    }
}

// Function to handle login
function login(username, password) {
    if (userProfiles[username] === password) {
        sessionStorage.setItem("loggedInUser", username); // Store the username
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('userHomeSection').style.display = 'block';
        document.getElementById('gamesSection').style.display = 'block';
        document.getElementById('usernameDisplay').textContent = username; // Display username
        fetchGameData(); // Fetch and display games
    } else {
        alert("Invalid username or password.");
    }
}

// Function to handle login form submission
function handleLogin(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    login(username, password); // Call the login function
}

// Function to update leaderboard based on game results
function updateLeaderboard() {
    Object.keys(userPicks).forEach(gameIndex => {
        const pickData = userPicks[gameIndex];
        const game = games[gameIndex];
        const result = game.status; // Example: if 'home' won, 'away' lost

        if ((result === 'home' && pickData.team === game.homeTeam) ||
            (result === 'away' && pickData.team === game.awayTeam)) {
            leaderboard[sessionStorage.getItem("loggedInUser")] += pickData.points;
        } else {
            leaderboard[sessionStorage.getItem("loggedInUser")] -= pickData.points;
        }
    });

    displayLeaderboard();
}

// Function to display the leaderboard in House Picks view
function displayLeaderboard() {
    const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    leaderboardTableBody.innerHTML = ''; // Clear existing rows

    Object.keys(leaderboard).forEach(user => {
        const row = leaderboardTableBody.insertRow();
        row.innerHTML = `
            <td>${user}</td>
            <td>${leaderboard[user]}</td>
        `;
    });
}

// Set up form to trigger handleLogin on submission
document.querySelector("form").onsubmit = handleLogin;
