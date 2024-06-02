const players = [
    { name: "Kyle Schultz", conference: "AL", team: "Wildcats" },
    { name: "Nick Saylor", conference: "AL", team: "Wildcats" },
    { name: "Jaxen Pearson", conference: "AL", team: "Wildcats" },
    { name: "Liam Jackson", conference: "AL", team: "Wildcats" },
    { name: "Drew Davis", conference: "AL", team: "Cobras" },
    { name: "Brendan Baranoski", conference: "AL", team: "Cobras" },
    { name: "Caden Irwin", conference: "AL", team: "Cobras" },
    { name: "Sean Flynn", conference: "AL", team: "Cobras" },
    { name: "Andy Durand", conference: "AL", team: "Cobras" },
    { name: "Brendan Szerlag", conference: "AL", team: "Cobras" },
    { name: "Chris Baranoski", conference: "AL", team: "Cobras" },
    { name: "Ryan Kracht", conference: "AL", team: "Predators" },
    { name: "Alec Warda", conference: "AL", team: "Predators" },
    { name: "Brennan Russell", conference: "AL", team: "Predators" },
    { name: "Rudy Ramirez", conference: "AL", team: "Predators" },
    { name: "Stephen McGlade", conference: "AL", team: "Predators" },
    { name: "Jack Aigner", conference: "AL", team: "Magic" },
    { name: "Grant Miller", conference: "AL", team: "Magic" },
    { name: "RJ Walgate", conference: "AL", team: "Magic" },
    { name: "Trevor Bonham", conference: "AL", team: "Magic" },
    { name: "AJ Ackerman", conference: "AL", team: "Magic" },
    { name: "Jordan Kurdi", conference: "AL", team: "Magic" },
    { name: "Tommy Coughlin III", conference: "NL", team: "Mallards" },
    { name: "Jordan Robles", conference: "NL", team: "Mallards" },
    { name: "Brendan Jorgensen", conference: "NL", team: "Mallards" },
    { name: "Preston Kolm", conference: "NL", team: "Mallards" },
    { name: "Matt Carlington", conference: "NL", team: "Mallards" },
    { name: "Brendan Davenport", conference: "NL", team: "Mallards" },
    { name: "Daniel Schultz", conference: "NL", team: "Eagles" },
    { name: "Dallas Allen", conference: "NL", team: "Eagles" },
    { name: "Zach Whalen", conference: "NL", team: "Eagles" },
    { name: "Blade Walker", conference: "NL", team: "Eagles" },
    { name: "Landon Yurgaites", conference: "NL", team: "Eagles" },
    { name: "Carson Yurgaites", conference: "NL", team: "Eagles" },
    { name: "Chris Cheetam", conference: "NL", team: "Gators" },
    { name: "Jason Chadwick", conference: "NL", team: "Gators" },
    { name: "Sawyer Behen", conference: "NL", team: "Gators" },
    { name: "Jimmy Knorp", conference: "NL", team: "D-backs" },
    { name: "Jonah Heath", conference: "NL", team: "D-backs" },
    { name: "Trey Flood", conference: "NL", team: "D-backs" },
    { name: "Jakob Pyszka", conference: "NL", team: "D-backs" },
    { name: "Casey Bennett", conference: "NL", team: "D-backs" }
];
const dailyPlayers = players; // Use the same list or a specific subset if needed

const guessCountKey = "guessCount";
const guessedPlayersKey = "guessedPlayers";
const dailyPlayerKey = "dailyPlayer";
const lastUpdatedKey = "lastUpdated";

let guessCount = 0;
const maxGuesses = 6;

function getDailyPlayer() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    // Use day of the year to determine the index of the daily player
    const playerIndex = dayOfYear % dailyPlayers.length;
    const dailyPlayer = dailyPlayers[playerIndex];

    // Save the daily player and the last updated time to localStorage
    localStorage.setItem(dailyPlayerKey, JSON.stringify(dailyPlayer));
    localStorage.setItem(lastUpdatedKey, now);
    return dailyPlayer;
}

function displayDailyPlayer() {
    const dailyPlayer = getDailyPlayer();
    document.getElementById("dailyPlayer").innerText = dailyPlayer.name;
}

function addGuessedPlayer() {
    const guessedPlayerName = document.getElementById("player-guessed").value;

    if (guessedPlayerName === "") {
        alert("Please enter a player's name.");
        return;
    }

    const guessedPlayer = players.find(player => player.name === guessedPlayerName);

    if (!guessedPlayer) {
        alert("Player not found.");
        return;
    }

    guessCount++;

    const dailyPlayer = getDailyPlayer();

    let hint = "";
    if (guessedPlayer.team === dailyPlayer.team) {
        hint = "Correct Team!";
    } else if (guessedPlayer.conference === dailyPlayer.conference) {
        hint = "Correct Conference!";
    } else {
        hint = "Incorrect guess.";
    }
    document.getElementById("hint").innerText = hint;

    const tableBody = document.getElementById("guessedPlayersTable").getElementsByTagName('tbody')[0];
    const newRow = tableBody.insertRow();
    const cell1 = newRow.insertCell(0);
    cell1.innerHTML = guessedPlayerName;

    let guessedPlayers = JSON.parse(localStorage.getItem(guessedPlayersKey)) || [];
    guessedPlayers.push(guessedPlayerName);
    localStorage.setItem(guessedPlayersKey, JSON.stringify(guessedPlayers));

    document.getElementById("player-guessed").value = "";

    if (guessCount >= maxGuesses) {
        alert(`The daily player was: ${dailyPlayer.name}`);
        disableInput();
    }

    localStorage.setItem(guessCountKey, guessCount);
}

function disableInput() {
    document.getElementById("player-guessed").disabled = true;
    document.getElementById("guessButton").disabled = true;
}

function loadGuessedPlayers() {
    const guessedPlayers = JSON.parse(localStorage.getItem(guessedPlayersKey)) || [];
    const tableBody = document.getElementById("guessedPlayersTable").getElementsByTagName('tbody')[0];
    guessedPlayers.forEach(playerName => {
        const newRow = tableBody.insertRow();
        const cell1 = newRow.insertCell(0);
        cell1.innerHTML = playerName;
    });
}

function resetGuessesIfNecessary() {
    const now = new Date();
    const lastUpdated = new Date(localStorage.getItem(lastUpdatedKey));

    if (lastUpdated.getDate() !== now.getDate() ||
        (lastUpdated.getDate() === now.getDate() && lastUpdated.getHours() < 7 && now.getHours() >= 7)) {
        guessCount = 0;
        localStorage.setItem(guessCountKey, guessCount);
        localStorage.setItem(guessedPlayersKey, JSON.stringify([]));
        localStorage.setItem(lastUpdatedKey, now);
        document.getElementById("player-guessed").disabled = false;
        document.getElementById("guessButton").disabled = false;
    }
}

function init() {
    resetGuessesIfNecessary();
    guessCount = parseInt(localStorage.getItem(guessCountKey)) || 0;

    if (guessCount >= maxGuesses) {
        disableInput();
    }

    displayDailyPlayer();
    loadGuessedPlayers();
}

window.onload = init;