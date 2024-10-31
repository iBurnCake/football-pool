// User profiles (username and password)
const userProfiles = {
    "AngelaKant": "KantAngela",
    "LukeRomano": "RomanoLuke",
    "RyanSanders": "SanderesRyan",
    "CharlesKeegan": "KeeganCharles"
};

// To store user picks and leaderboard
let userPicks = {};
let assignedPoints = new Set();
let leaderboard = [];
let games = []; // Global variable to hold game details after fetching

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
        
        // Array to store details of each game event
        games = [];

        // Loop through each game URL and fetch specific game data
        for (let item of data.items) {
            const gameResponse = await fetch(item.$ref);
            const gameData = await gameResponse.json();

            const game = {
                homeTeam: gameData.competitions[0].competitors[0].team.displayName,
                awayTeam: gameData.competitions[0].competitors[1].team.displayName,
                date: gameData.date,
                status: gameData.status.type.shortDetail
            };

            games.push(game);
        }

        displayGames(games);

    } catch (error) {
        console.error("Error fetching NFL data:", error);
    }
}

// Function to display games on the page
function displayGames(games) {
    const tableBody = document.getElementById('gamesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear existing rows

    games.forEach((game, index) => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${game.homeTeam} vs ${game.awayTeam}</td>
            <td>${new Date(game.date).toLocaleString()}</td>
            <td>${game.status}</td>
            <td>
                <button onclick="pickGame(${index})">Pick</button>
            </td>
            <td>
                <input type="number" id="confidence${index}" min="1" max="15" required>
            </td>
        `;
    });
}

// Function to handle user login
function login(username, password) {
    if (userProfiles[username] === password) {
        alert("Login successful!");
        sessionStorage.setItem("loggedInUser", username); // Store the username
        fetchGameData(); // Call to fetch and display games after login
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

// Function to handle game pick
function pickGame(index) {
    const confidenceInput = document.getElementById(`confidence${index}`);
    const confidencePoints = parseInt(confidenceInput.value);

    if (assignedPoints.has(confidencePoints)) {
        alert("You have already used this confidence point!");
        return;
    }

    if (confidencePoints < 1 || confidencePoints > 15) {
        alert("Please select a valid confidence point between 1 and 15.");
        return;
    }

    assignedPoints.add(confidencePoints);
    userPicks[index] = {
        game: games[index],
        points: confidencePoints
    };
    confidenceInput.disabled = true; // Disable input after picking
    alert(`You've picked ${games[index].homeTeam} vs ${games[index].awayTeam} with ${confidencePoints} points.`);
    updateLeaderboard(); // Update leaderboard after each pick
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
