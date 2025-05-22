// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function() {
    // Get references to the search bar and filter button
    const searchBar = document.getElementById("search-bar");
    const speciesFilter = document.getElementById("species-filter");
    const filterButton = document.getElementById("filter-button");
    const petCards = document.querySelectorAll(".pet-card");

    // Function to filter pets
    function filterPets() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedSpecies = speciesFilter.value;

        petCards.forEach(card => {
            const petName = card.querySelector("h3").textContent.toLowerCase();
            const petSpecies = card.getAttribute("data-species"); // Assuming you add data-species attribute

            // Check if the pet matches the search term and species filter
            const matchesSearch = petName.includes(searchTerm);
            const matchesSpecies = selectedSpecies === "" || petSpecies === selectedSpecies;

            // Show or hide the pet card based on the matches
            if (matchesSearch && matchesSpecies) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Add event listeners
    filterButton.addEventListener("click", filterPets);
    searchBar.addEventListener("input", filterPets);
    speciesFilter.addEventListener("change", filterPets);
});