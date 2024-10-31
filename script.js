// User profiles (username and password)
const userProfiles = {
    "AngelaKant": "5353",
    "LukeRomano": "4242",
    "RyanSanders": "8989",
    "CharlesKeegan": "0000"
};

// To store user picks and leaderboard
let userPicks = {}; // Track selected teams for each game
let assignedPoints = new Set(); // Track used confidence points to ensure uniqueness
let leaderboard = [];
let games = []; // Global variable to hold game details after fetching

// Sample games data (use this temporarily or replace with actual API data)
const sampleGames = [
    { homeTeam: 'Vikings', awayTeam: 'Packers', homeRecord: '5-2', awayRecord: '3-4' },
    { homeTeam: 'Jets', awayTeam: 'Patriots', homeRecord: '2-5', awayRecord: '1-6' },
    { homeTeam: 'Bears', awayTeam: 'Lions', homeRecord: '1-5', awayRecord: '3-3' },
    { homeTeam: 'Chargers', awayTeam: 'Raiders', homeRecord: '4-3', awayRecord: '2-5' },
    { homeTeam: 'Dolphins', awayTeam: 'Bills', homeRecord: '4-4', awayRecord: '5-2' }
];

// Function to fetch NFL game data from the API
async function fetchGameData() {
    try {
        const response = await fetch('https://sports.core.api.espn.com/v2/sports/football/leagues/nfl/events', {
            headers: {
                'x-api-key': 'cf87518a-2988-4c7b-8ac9-4443bb'
            }
        });

        if (!response.ok) throw new Error("Failed to fetch game events");

        const data = await response.json();
        
        games = data.items.map((item) => ({
            homeTeam: item.homeTeam,  // Replace with actual data structure from API response
            awayTeam: item.awayTeam,
            homeRecord: item.homeRecord,
            awayRecord: item.awayRecord,
            date: item.date,
            status: item.status
        }));

        displayGames(games);

    } catch (error) {
        console.error("Error fetching NFL data:", error);
        displayGames(sampleGames); // Use sample data if API fails
    }
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
    userPicks[gameIndex] = team;
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
        document.getElementById('leaderboardSection').style.display = 'block';
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

// Function to update the leaderboard
function updateLeaderboard() {
    leaderboard = Object.entries(userPicks).map(([key, value]) => ({
        username: sessionStorage.getItem("loggedInUser") || "Anonymous",
        totalPoints: value.points
    }));

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    displayLeaderboard();
}

// Function to display the leaderboard
function displayLeaderboard() {
    const leaderboardTableBody = document.getElementById('leaderboardTable').getElementsByTagName('tbody')[0];
    leaderboardTableBody.innerHTML = ''; // Clear existing rows

    leaderboard.forEach(user => {
        const row = leaderboardTableBody.insertRow();
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.totalPoints}</td>
        `;
    });
}

// Set up form to trigger handleLogin on submission
document.querySelector("form").onsubmit = handleLogin;

// Initial call to load games
fetchGameData();
