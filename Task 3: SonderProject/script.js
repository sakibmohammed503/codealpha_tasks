// Initialize the map
const map = L.map('map', {
    center: [20, 0],
    zoom: 2,
    minZoom: 2,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 1.0
});

// Add a tile layer (using a dark theme)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// DOM elements
const mistOverlay = document.querySelector('.mist-overlay');
const exploreButton = document.getElementById('explore-button');
const storyPanel = document.querySelector('.story-panel');
const closeButton = document.querySelector('.close-button');
const randomStoryButton = document.getElementById('random-story');
const clearMistButton = document.getElementById('clear-mist');
const submitStoryButton = document.getElementById('submit-story');
const particlesContainer = document.getElementById('particles-container');

// Sample stories data
const stories = [
    {
        title: "Unexpected Kindness",
        content: "I was lost in the Tokyo subway system, clearly looking confused with my oversized backpack. A salaryman who didn't speak English noticed my distress and walked 15 minutes out of his way to lead me to the right station, bowing politely before hurrying off.",
        location: "Tokyo, Japan",
        coords: [35.6762, 139.6503]
    },
    {
        title: "Midnight Connection",
        content: "At 3 AM in a Marrakech hostel courtyard, I shared mint tea with a Norwegian photographer and a local artisan. We didn't share a common language, but through gestures and smiles, we connected deeply under the starry desert sky.",
        location: "Marrakech, Morocco",
        coords: [31.6295, -7.9811]
    },
    {
        title: "Rainy Day Rescue",
        content: "Caught in a sudden downpour in Rome, I was sheltering under a narrow awning when an elderly Italian woman pulled me into her doorway, handed me a towel, and insisted I wait out the storm with a cup of hot espresso.",
        location: "Rome, Italy",
        coords: [41.9028, 12.4964]
    },
    {
        title: "Shared Sunset",
        content: "Watching the sunset over the Grand Canyon, I struck up a conversation with a stranger next to me. We discovered we were both there to process major life changes, and in that moment, we felt less alone in our journeys.",
        location: "Grand Canyon, USA",
        coords: [36.0544, -112.1401]
    },
    {
        title: "Market Laughter",
        content: "Trying to bargain at a Bangkok floating market, I accidentally offered an absurdly low price. Instead of being offended, the vendor burst into laughter, then taught me the proper way to haggle while giving me samples of every fruit on her boat.",
        location: "Bangkok, Thailand",
        coords: [13.7563, 100.5018]
    },
    {
        title: "Silent Understanding",
        content: "On a crowded train in Mumbai, I witnessed a young mother struggling with her groceries and toddler. Without a word, three different passengers simultaneously stood up to offer their seats, creating a moment of silent community.",
        location: "Mumbai, India",
        coords: [19.0760, 72.8777]
    }
];

// Create floating particles
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        
        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        
        // Random animation
        const duration = 15 + Math.random() * 20;
        const delay = Math.random() * 5;
        
        particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
        
        particlesContainer.appendChild(particle);
    }
}

// Show a story at specific coordinates
function showStory(story, coords) {
    // Update story panel content
    document.querySelector('.story-title').textContent = story.title;
    document.querySelector('.story-content').textContent = story.content;
    document.querySelector('.story-location span:last-child').textContent = story.location;
    
    // Show the story panel
    storyPanel.classList.add('active');
    
    // Create a pulse effect at the story location
    if (coords) {
        const pulse = document.createElement('div');
        pulse.classList.add('pulse');
        
        const point = map.latLngToContainerPoint(coords);
        pulse.style.left = `${point.x - 10}px`;
        pulse.style.top = `${point.y - 10}px`;
        
        document.querySelector('.map-container').appendChild(pulse);
        
        // Remove pulse after animation
        setTimeout(() => {
            pulse.remove();
        }, 2000);
    }
}

// Get a random story
function getRandomStory() {
    return stories[Math.floor(Math.random() * stories.length)];
}

// Event listeners
exploreButton.addEventListener('click', () => {
    mistOverlay.classList.add('hidden');
});

closeButton.addEventListener('click', () => {
    storyPanel.classList.remove('active');
});

randomStoryButton.addEventListener('click', () => {
    const randomStory = getRandomStory();
    showStory(randomStory, randomStory.coords);
    
    // Pan to the story location
    map.panTo(randomStory.coords);
});

clearMistButton.addEventListener('click', () => {
    mistOverlay.classList.add('hidden');
});

submitStoryButton.addEventListener('click', () => {
    alert("Story submission feature coming soon! In a full implementation, this would open a form to submit your own story.");
});

// Map click event
map.on('click', (e) => {
    // Clear any existing mist
    mistOverlay.classList.add('hidden');
    
    // Show a random story
    const randomStory = getRandomStory();
    showStory(randomStory, e.latlng);
});

// Close story panel when clicking outside
document.addEventListener('click', (e) => {
    if (storyPanel.classList.contains('active') && 
        !storyPanel.contains(e.target) && 
        !e.target.classList.contains('control-button')) {
        storyPanel.classList.remove('active');
    }
});

// Initialize particles
createParticles();

// Add some random story markers to the map (optional visual enhancement)
stories.forEach(story => {
    if (story.coords) {
        // Create a custom icon
        const storyIcon = L.divIcon({
            className: 'story-marker',
            html: '✨',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        // Add marker to map
        L.marker(story.coords, { icon: storyIcon }).addTo(map);
    }
});