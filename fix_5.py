// quartz/components/scripts/map.inline.ts

import L from 'leaflet';

// Define the map coordinates and zoom level
const map = L.map('map').setView([51.505, -0.09], 13);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Define the locations and their coordinates
const locations = [
    { name: 'Dusty Frontier', lat: 51.5, lng: -0.09 },
    { name: 'Raft', lat: 51.51, lng: -0.1 },
    { name: 'The Shambling Woods', lat: 51.52, lng: -0.11 },
    { name: 'Titan\'s Rest', lat: 51.53, lng: -0.12 },
    { name: 'Esprin Empire territory', lat: 51.54, lng: -0.13 }
];

// Add markers for each location
locations.forEach(location => {
    const marker = L.marker([location.lat, location.lng]).addTo(map);
    marker.bindPopup(location.name);
});

// Add a legend to the map
const legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4>Legend</h4>';
    locations.forEach(location => {
        div.innerHTML += `<i style="background:${getColor(location.name)}"></i> ${location.name}<br>`;
    });
    return div;
};

legend.addTo(map);

// Function to get color based on location name
function getColor(d) {
    switch (d) {
        case 'Dusty Frontier': return 'red';
        case 'Raft': return 'blue';
        case 'The Shambling Woods': return 'green';
        case 'Titan\'s Rest': return 'purple';
        case 'Esprin Empire territory': return 'orange';
        default: return 'grey';
    }
}