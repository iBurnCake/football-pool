document.addEventListener("DOMContentLoaded", () => {
    const housePicksTable = document.getElementById("housePicksTable");

    // Example data - for actual use, fetch data
    const housePicks = [
        { game: "Texans vs Jets", user: "LukeRomano", pick: "Texans", points: 8 },
        { game: "Texans vs Jets", user: "AngelaKant", pick: "Jets", points: 10 },
        // More picks here...
    ];

    displayHousePicks(housePicks);
});

function displayHousePicks(housePicks) {
    const tableBody = document.getElementById('housePicksTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing rows

    housePicks.forEach(pick => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${pick.game}</td>
            <td>${pick.user}</td>
            <td>${pick.pick}</td>
            <td>${pick.points}</td>
            <td class="${pick.result === 'Win' ? 'win' : ''}">${pick.result || 'Pending'}</td>
        `;
    });
}
