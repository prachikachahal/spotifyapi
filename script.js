const clientId = 'YOUR_SPOTIFY_CLIENT_ID';
const redirectUri = 'YOUR_REDIRECT_URI';
const scopes = 'user-top-read';

document.getElementById('loginButton').addEventListener('click', () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token&show_dialog=true`;
    window.location.href = authUrl;
});

window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1).split('&').reduce((initial, item) => {
        if (item) {
            const parts = item.split('=');
            initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
    }, {});

    if (hash.access_token) {
        fetchTopTracks(hash.access_token);
    }
});

function fetchTopTracks(token) {
    fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayTracks(data.items);
        document.getElementById('dashboard').style.display = 'block';
    })
    .catch(error => console.error('Error fetching top tracks:', error));
}

function displayTracks(tracks) {
    const tracksList = document.getElementById('tracks');
    tracksList.innerHTML = '';
    tracks.forEach(track => {
        const trackItem = document.createElement('li');
        trackItem.textContent = `${track.name} by ${track.artists.map(artist => artist.name).join(', ')}`;
        tracksList.appendChild(trackItem);
    });
}
