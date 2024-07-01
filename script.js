document.addEventListener('DOMContentLoaded', function () {
    const cardsContainer = document.getElementById('cards-container');
    const addCardButton = document.getElementById('add-card-button');
    const topicInput = document.getElementById('topic-input');

    // Event listener for the "Add Card" button
    addCardButton.addEventListener('click', function () {
        const topic = topicInput.value.trim();
        if (topic) {
            createCard(topic); // Call createCard function if topic is not empty
            topicInput.value = ''; // Clear the input field after creating the card
        } else {
            alert('Please enter a topic'); // Alert user if topic input is empty
        }
    });

    // Function to create a new tracking card
    function createCard(topic) {
        const card = document.createElement('div');
        card.className = 'tracking-card';

        const title = document.createElement('h1');
        title.textContent = '100 DAYS TRACKING'; // Title of the card

        const topicElement = document.createElement('p');
        topicElement.textContent = `TOPIC -- ${topic}`; // Topic content of the card

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = '×'; // Delete button to remove the card
        deleteButton.addEventListener('click', function () {
            cardsContainer.removeChild(card); // Remove the card from the container
            saveProgress(); // Save progress after deleting the card
        });

        const grid = document.createElement('div');
        grid.className = 'grid';

        // Loop to create 100 circles (days) for tracking progress
        for (let i = 1; i <= 100; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            circle.dataset.day = i; // Assign day number as data attribute
            circle.addEventListener('click', function () {
                this.classList.toggle('completed'); // Toggle completed class on click
                saveProgress(); // Save progress after updating completion status
            });
            grid.appendChild(circle); // Append circle to the grid
        }

        // Append all elements to the card
        card.appendChild(title);
        card.appendChild(topicElement);
        card.appendChild(deleteButton);
        card.appendChild(grid);
        cardsContainer.appendChild(card); // Append the card to the cards container

        saveProgress(); // Save progress after creating the card
    }

    // Function to save progress to localStorage
    function saveProgress() {
        const cards = document.querySelectorAll('.tracking-card');
        const progress = [];

        cards.forEach((card, cardIndex) => {
            const circles = card.querySelectorAll('.circle');
            const completedDays = [];
            circles.forEach((circle, circleIndex) => {
                if (circle.classList.contains('completed')) {
                    completedDays.push(circleIndex); // Push completed day index to array
                }
            });
            // Push card progress (topic and completed days) to progress array
            progress.push({
                topic: card.querySelector('p').textContent.replace('TOPIC -- ', ''),
                completedDays
            });
        });

        localStorage.setItem('progress', JSON.stringify(progress)); // Store progress in localStorage
    }

    // Function to load progress from localStorage
    function loadProgress() {
        const progress = JSON.parse(localStorage.getItem('progress')) || [];

        // Iterate through stored progress and recreate cards with completed days
        progress.forEach(cardProgress => {
            createCard(cardProgress.topic); // Create card for each stored topic
            const cards = document.querySelectorAll('.tracking-card');
            const lastCard = cards[cards.length - 1]; // Get the last created card
            const circles = lastCard.querySelectorAll('.circle');

            // Add 'completed' class to circles based on stored completed days
            cardProgress.completedDays.forEach(dayIndex => {
                circles[dayIndex].classList.add('completed');
            });
        });
    }

    loadProgress(); // Load progress when the page loads
});
