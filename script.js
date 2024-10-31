// User profiles (username and password)
const userProfiles = {
    "AngelaKant": "5353",
    "LukeRomano": "4242",
    "RyanSanders": "8989",
    "CharlesKeegan": "0000"
};

// To store user picks and assigned points
let userPicks = {}; // Track selected teams for each game
let assignedPoints = new Set(); // Track used confidence points
let games = []; // Global variable to hold game details after fetching

// Function to fetch NFL game data from the API
async function fetchGameData() {
    // (API fetching logic remains the same)
}

// Function to display games in the table
function displayGames(games) {
    const tableBody = document.getElementById('gamesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing rows

    games.forEach((game, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${game.homeTeam} vs ${game.awayTeam}</td>
            <td>${game.homeRecord} - ${game.awayRecord}</td>
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

// Track selected picks and used confidence points
function selectPick(gameIndex, team) {
    userPicks[gameIndex] = { team, points: null };
    alert(`You selected ${team} for game ${gameIndex + 1}`);
}

function assignConfidence(gameIndex) {
    const confidenceInput = document.getElementById(`confidence${gameIndex}`);
    const points = parseInt(confidenceInput.value);

    if (usedPoints.has(points)) {
        alert("This confidence point is already used. Choose a different one.");
        confidenceInput.value = ''; // Clear duplicate entry
    } else if (points >= 1 && points <= 16) {
        usedPoints.add(points);
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

// Function to display the user's personal leaderboard
function showUserLeaderboard() {
    document.getElementById('leaderboardSection').style.display = 'block';
    displayLeaderboard();
}

// Function to update and display the personal leaderboard
function displayLeaderboard() {
    const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    leaderboardTableBody.innerHTML = ''; // Clear existing rows

    Object.entries(userPicks).forEach(([gameIndex, pickData]) => {
        const row = leaderboardTableBody.insertRow();
        row.innerHTML = `
            <td>Game ${parseInt(gameIndex) + 1}</td>
            <td>${pickData.team}</td>
            <td>${pickData.points}</td>
            <td>${pickData.result || 'Pending'}</td>
        `;
    });
}

// Set up form to trigger handleLogin on submission
document.querySelector("form").onsubmit = handleLogin;
