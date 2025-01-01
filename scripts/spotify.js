import { redirectToSpotifyLogin } from './login.js';

if (window.localStorage.getItem('access_token') != null) {
    //console.log('style.display: ' + document.getElementById('#spotify-login').style.display);
    document.getElementById('spotify-login').style.display = 'none';
    await fetchSpotifyUserProfile();
} else {
    document.getElementById('spotify-login').style.display = 'block';
    const spotifyLogin = document.querySelector('#spotify-login');

    spotifyLogin.addEventListener("click", event => {
        console.log("button clicked");
        redirectToSpotifyLogin();
    })
}

// Step 3: Use access token for Spotify API calls
async function fetchSpotifyUserProfile() {
    const accessToken = window.localStorage.getItem('access_token');
    if (!accessToken) {
        console.error('Access token not found. Please log in.');
        return;
    }

    const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.ok) {
        const userData = await response.json();
        console.log('Spotify User Data:', userData);
    } else {
        console.error('Error fetching Spotify user data:', await response.json());
    }
}
